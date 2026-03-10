import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { asMarketplaceDb, marketplaceDb } from '@/lib/marketplaceDb';
import {
  MIN_ADVANCE_BOOKING_MINUTES,
  addMinutes,
  calculateBookingTotalCents,
  calculatePlatformFeeCents,
  requireUserProfile,
} from '@/lib/marketplace';

export const runtime = 'nodejs';

const CreateBookingSchema = z.object({
  serviceId: z.string().uuid(),
  startsAt: z.coerce.date(),
  timezone: z.string().trim().min(2).max(80),
  inPersonVenue: z.string().trim().min(3).max(240).optional(),
  meetingLink: z.string().url().optional(),
});

export async function GET(request: Request) {
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  try {
    const url = new URL(request.url);
    const asRole = url.searchParams.get('as');

    const where =
      asRole === 'teacher'
        ? { teacherId: user.profile.id }
        : asRole === 'student'
          ? { studentId: user.profile.id }
          : { OR: [{ studentId: user.profile.id }, { teacherId: user.profile.id }] };

    const bookings = await marketplaceDb.booking.findMany({
      where,
      include: {
        service: {
          select: {
            title: true,
            mode: true,
            sessionMinutes: true,
            subjectSlug: true,
          },
        },
        student: {
          select: {
            id: true,
            displayName: true,
          },
        },
        teacher: {
          select: {
            user: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: [{ startsAt: 'asc' }, { createdAt: 'desc' }],
      take: 100,
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = CreateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;

  if (payload.startsAt.getTime() < addMinutes(new Date(), MIN_ADVANCE_BOOKING_MINUTES).getTime()) {
    return NextResponse.json(
      { error: `Bookings must be made at least ${MIN_ADVANCE_BOOKING_MINUTES} minutes in advance.` },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const txdb = asMarketplaceDb(tx);
      const service = (await txdb.teacherService.findUnique({
        where: { id: payload.serviceId },
        include: {
          teacher: {
            select: { userId: true, isActive: true, verificationStatus: true },
          },
        },
      })) as
        | {
            id: string;
            mode: 'online' | 'in_person';
            rateCents: number;
            sessionMinutes: number;
            teacherId: string;
            teacher: { userId: string; isActive: boolean; verificationStatus: string };
          }
        | null;

      if (!service || !service.teacher.isActive || service.teacher.verificationStatus !== 'approved') {
        return { status: 'invalid_service' as const };
      }

      if (service.teacherId === user.profile.id) {
        return { status: 'self_booking' as const };
      }

      const endsAt = addMinutes(payload.startsAt, service.sessionMinutes);
      const overlap = await txdb.booking.findFirst({
        where: {
          teacherId: service.teacherId,
          status: { in: ['pending_payment', 'confirmed', 'in_session'] },
          AND: [{ startsAt: { lt: endsAt } }, { endsAt: { gt: payload.startsAt } }],
        },
        select: { id: true },
      });

      if (overlap) return { status: 'slot_taken' as const };

      const agreedRateCents = service.rateCents;
      const platformFeeCents = calculatePlatformFeeCents(agreedRateCents);
      const totalChargeCents = calculateBookingTotalCents(agreedRateCents);

      const booking = await txdb.booking.create({
        data: {
          studentId: user.profile.id,
          teacherId: service.teacherId,
          serviceId: service.id,
          mode: service.mode,
          status: 'pending_payment',
          startsAt: payload.startsAt,
          endsAt,
          timezone: payload.timezone,
          agreedRateCents,
          platformFeeCents,
          totalChargeCents,
          meetingLink: service.mode === 'online' ? payload.meetingLink : null,
          inPersonVenue: service.mode === 'in_person' ? payload.inPersonVenue : null,
        },
      });

      return { status: 'created' as const, booking };
    });

    if (result.status === 'invalid_service') {
      return NextResponse.json({ error: 'Teacher service not available for booking' }, { status: 400 });
    }
    if (result.status === 'self_booking') {
      return NextResponse.json({ error: 'You cannot book your own service' }, { status: 400 });
    }
    if (result.status === 'slot_taken') {
      return NextResponse.json({ error: 'Selected time slot is no longer available' }, { status: 409 });
    }

    return NextResponse.json({ booking: result.booking }, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

