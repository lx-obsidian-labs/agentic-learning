import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { asMarketplaceDb } from '@/lib/marketplaceDb';
import { requireUserProfile } from '@/lib/marketplace';

export const runtime = 'nodejs';

type Params = { params: Promise<{ bookingId: string }> };

export async function POST(_: Request, { params }: Params) {
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  const { bookingId } = await params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const txdb = asMarketplaceDb(tx);
      const booking = (await txdb.booking.findUnique({
        where: { id: bookingId },
      })) as
        | {
            id: string;
            studentId: string;
            teacherId: string;
            status: string;
          }
        | null;

      if (!booking) return { status: 'not_found' as const };
      if (booking.studentId !== user.profile.id && booking.teacherId !== user.profile.id) {
        return { status: 'forbidden' as const };
      }
      if (booking.status !== 'confirmed' && booking.status !== 'in_session') {
        return { status: 'invalid_status' as const };
      }

      const updated = await txdb.booking.update({
        where: { id: booking.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      return { status: 'completed' as const, booking: updated };
    });

    if (result.status === 'not_found') return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (result.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (result.status === 'invalid_status') {
      return NextResponse.json({ error: 'Booking cannot be completed in current state' }, { status: 409 });
    }

    return NextResponse.json({ success: true, booking: result.booking });
  } catch (error) {
    console.error('Failed to complete booking:', error);
    return NextResponse.json(
      { error: 'Failed to complete booking', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

