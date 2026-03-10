import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { asMarketplaceDb } from '@/lib/marketplaceDb';
import { MARKETPLACE_CURRENCY, requireUserProfile } from '@/lib/marketplace';

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
            totalChargeCents: number;
            platformFeeCents: number;
          }
        | null;

      if (!booking) return { status: 'not_found' as const };
      if (booking.studentId !== user.profile.id) return { status: 'forbidden' as const };
      if (booking.status !== 'pending_payment') return { status: 'invalid_status' as const };

      const providerRef = `booking-pay-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      await txdb.paymentTransaction.create({
        data: {
          bookingId: booking.id,
          payerId: user.profile.id,
          teacherId: booking.teacherId,
          type: 'booking_charge',
          status: 'captured',
          provider: 'simulated',
          providerRef,
          amountCents: booking.totalChargeCents,
          currency: MARKETPLACE_CURRENCY,
          platformFeeCents: booking.platformFeeCents,
        },
      });

      const updated = await txdb.booking.update({
        where: { id: booking.id },
        data: { status: 'confirmed' },
      });

      return { status: 'paid' as const, booking: updated };
    });

    if (result.status === 'not_found') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (result.status === 'forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (result.status === 'invalid_status') {
      return NextResponse.json({ error: 'Booking is not awaiting payment' }, { status: 409 });
    }

    return NextResponse.json({ success: true, booking: result.booking });
  } catch (error) {
    console.error('Failed to pay booking:', error);
    return NextResponse.json(
      { error: 'Failed to pay booking', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

