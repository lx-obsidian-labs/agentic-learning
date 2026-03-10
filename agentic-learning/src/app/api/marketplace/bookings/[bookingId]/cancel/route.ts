import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { asMarketplaceDb } from '@/lib/marketplaceDb';
import { MARKETPLACE_CURRENCY, getCancellationRefundRatio, requireUserProfile } from '@/lib/marketplace';

export const runtime = 'nodejs';

const CancelSchema = z.object({
  reason: z.string().trim().min(3).max(300).optional(),
});

type Params = { params: Promise<{ bookingId: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  const { bookingId } = await params;

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // optional body
  }
  const parsed = CancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

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
            startsAt: Date;
            totalChargeCents: number;
          }
        | null;

      if (!booking) return { status: 'not_found' as const };

      const isStudent = booking.studentId === user.profile.id;
      const isTeacher = booking.teacherId === user.profile.id;
      if (!isStudent && !isTeacher) return { status: 'forbidden' as const };

      if (!['pending_payment', 'confirmed'].includes(booking.status)) {
        return { status: 'invalid_status' as const };
      }

      const refundRatio = booking.status === 'pending_payment' ? 0 : getCancellationRefundRatio(booking.startsAt);
      const refundCents = Math.round(booking.totalChargeCents * refundRatio);

      const updated = await txdb.booking.update({
        where: { id: booking.id },
        data: {
          status: isStudent ? 'cancelled_by_student' : 'cancelled_by_teacher',
          cancelReason: parsed.data.reason ?? null,
          cancelledAt: new Date(),
        },
      });

      if (refundCents > 0) {
        await txdb.paymentTransaction.create({
          data: {
            bookingId: booking.id,
            payerId: booking.studentId,
            teacherId: booking.teacherId,
            type: 'booking_refund',
            status: 'refunded',
            provider: 'simulated',
            providerRef: `booking-refund-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            amountCents: refundCents,
            currency: MARKETPLACE_CURRENCY,
          },
        });
      }

      return { status: 'cancelled' as const, booking: updated, refundCents };
    });

    if (result.status === 'not_found') return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (result.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (result.status === 'invalid_status') {
      return NextResponse.json({ error: 'Booking cannot be cancelled in current state' }, { status: 409 });
    }

    return NextResponse.json({ success: true, booking: result.booking, refundCents: result.refundCents });
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

