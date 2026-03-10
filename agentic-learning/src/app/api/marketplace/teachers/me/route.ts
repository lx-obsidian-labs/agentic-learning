import { NextResponse } from 'next/server';
import { ensureMarketplaceDb } from '@/lib/marketplaceDb';
import { requireUserProfile } from '@/lib/marketplace';

export const runtime = 'nodejs';

export async function GET() {
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  try {
    const marketplaceDb = ensureMarketplaceDb();
    const teacher = await marketplaceDb.teacherProfile.findUnique({
      where: { userId: user.profile.id },
      include: {
        services: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    return NextResponse.json({ teacher });
  } catch (error) {
    console.error('Failed to fetch teacher profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher profile', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
