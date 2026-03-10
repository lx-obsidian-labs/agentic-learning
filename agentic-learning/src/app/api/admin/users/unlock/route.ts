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

  const { userId } = body as { userId?: string };

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/unlock`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Clerk API error:', error);
      return NextResponse.json({ error: 'Failed to unlock user' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User unlocked' });
  } catch (err) {
    console.error('Failed to unlock user:', err);
    return NextResponse.json({ error: 'Failed to unlock user' }, { status: 500 });
  }
}
