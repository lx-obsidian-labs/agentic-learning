import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: unknown;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = (evt as { type: string }).type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const data = evt as { data: { id: string; email_addresses?: { email_address: string }[]; first_name?: string; last_name?: string; username?: string } };
    const { id, email_addresses, first_name, last_name, username } = data.data;
    
    const email = email_addresses?.[0]?.email_address;
    const fullName = [first_name, last_name].filter(Boolean).join(' ') || username || email?.split('@')[0];

    try {
      await prisma.userProfile.upsert({
        where: { clerkUserId: id },
        create: {
          clerkUserId: id,
          displayName: fullName,
          role: 'student',
        },
        update: {
          displayName: fullName,
        },
      });

      console.log(`User ${id} synced to database`);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Failed to sync user:', err);
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const data = evt as { data: { id: string } };
    const { id } = data.data;
    
    try {
      await prisma.userProfile.delete({
        where: { clerkUserId: id },
      });
      
      console.log(`User ${id} deleted from database`);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Failed to delete user:', err);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
