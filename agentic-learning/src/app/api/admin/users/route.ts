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

export async function GET(request: Request) {
  const { userId: currentUserId } = await auth();
  
  if (!currentUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdminUser = await isAdmin(currentUserId);
  if (!isAdminUser) {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 50));
  const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
  const role = url.searchParams.get('role');

  try {
    const where = role ? { role: role as 'student' | 'teacher' | 'admin' } : {};

    const [users, total] = await Promise.all([
      prisma.userProfile.findMany({
        where,
        select: {
          id: true,
          clerkUserId: true,
          displayName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              lessonCompletions: true,
              quizAttempts: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.userProfile.count({ where }),
    ]);

    const clerkUserIds = users.map(u => u.clerkUserId);
    
    const clerkUsers = await fetch(`https://api.clerk.com/v1/users?user_id=${clerkUserIds.join(',')}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    let clerkData: { id: string; email_addresses?: { email_address: string }[]; image_url?: string; locked?: boolean }[] = [];
    if (clerkUsers.ok) {
      const clerkJson = await clerkUsers.json();
      clerkData = clerkJson.data || [];
    }

    const mergedUsers = users.map(profile => {
      const clerkUser = clerkData.find(c => c.id === profile.clerkUserId);
      return {
        id: profile.id,
        clerkUserId: profile.clerkUserId,
        displayName: profile.displayName,
        email: clerkUser?.email_addresses?.[0]?.email_address || null,
        imageUrl: clerkUser?.image_url || null,
        role: profile.role,
        locked: clerkUser?.locked || false,
        createdAt: profile.createdAt,
        stats: {
          lessonsCompleted: profile._count.lessonCompletions,
          quizAttempts: profile._count.quizAttempts,
          bookmarks: profile._count.bookmarks,
        },
      };
    });

    return NextResponse.json({
      users: mergedUsers,
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Failed to fetch users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
