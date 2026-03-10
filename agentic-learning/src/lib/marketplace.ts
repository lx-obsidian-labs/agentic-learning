import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const MARKETPLACE_CURRENCY = 'ZAR';
export const TEACHER_REGISTRATION_FEE_CENTS = 49_900;
export const PLATFORM_COMMISSION_BPS = 1_500; // 15%
export const MIN_ADVANCE_BOOKING_MINUTES = 30;

export function calculatePlatformFeeCents(rateCents: number): number {
  return Math.round((rateCents * PLATFORM_COMMISSION_BPS) / 10_000);
}

export function calculateBookingTotalCents(rateCents: number): number {
  return rateCents + calculatePlatformFeeCents(rateCents);
}

export function formatCents(cents: number, currency = MARKETPLACE_CURRENCY): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(cents / 100);
}

export async function requireUserProfile() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return { error: 'Unauthorized' as const };

  const profile = await prisma.userProfile.upsert({
    where: { clerkUserId },
    create: { clerkUserId, role: 'student' },
    update: {},
  });

  return { profile };
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function getCancellationRefundRatio(startsAt: Date): number {
  const msUntilStart = startsAt.getTime() - Date.now();
  const hoursUntilStart = msUntilStart / (1000 * 60 * 60);
  if (hoursUntilStart >= 24) return 1;
  if (hoursUntilStart >= 2) return 0.5;
  return 0;
}

