import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function isAdmin(userId: string): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });
  return profile?.role === 'admin';
}

export async function POST(request: Request) {
  const { userId: currentUserId } = await auth();
  
  if (!currentUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdminUser = await isAdmin(currentUserId);
  if (!isAdminUser) {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { userId, expiresInSeconds = 600 } = body as { userId?: string; expiresInSeconds?: number };

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.clerk.com/v1/actor_tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify({
        user_id: userId,
        expires_in_seconds: expiresInSeconds,
        actor: {
          sub: currentUserId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Clerk API error:', error);
      return NextResponse.json({ error: 'Failed to create impersonation token' }, { status: 500 });
    }

    const actorToken = await response.json();

    return NextResponse.json({
      tokenId: actorToken.id,
      url: actorToken.url,
      expiresAt: actorToken.expires_at,
    });
  } catch (err) {
    console.error('Failed to create actor token:', err);
    return NextResponse.json({ error: 'Failed to create impersonation token' }, { status: 500 });
  }
}
