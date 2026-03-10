import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  MARKETPLACE_CURRENCY,
  TEACHER_REGISTRATION_FEE_CENTS,
  formatCents,
  requireUserProfile,
} from '@/lib/marketplace';
import { asMarketplaceDb } from '@/lib/marketplaceDb';

export const runtime = 'nodejs';

export async function POST() {
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const txdb = asMarketplaceDb(tx);
      const teacher = (await txdb.teacherProfile.findUnique({
        where: { userId: user.profile.id },
      })) as { registrationFeePaidAt?: Date | null } | null;

      if (!teacher) {
        return { status: 'missing_teacher' as const };
      }

      if (teacher.registrationFeePaidAt) {
        return { status: 'already_paid' as const, paidAt: teacher.registrationFeePaidAt };
      }

      const providerRef = `teacher-reg-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

      await txdb.paymentTransaction.create({
        data: {
          payerId: user.profile.id,
          teacherId: user.profile.id,
          type: 'teacher_registration',
          status: 'captured',
          provider: 'simulated',
          providerRef,
          amountCents: TEACHER_REGISTRATION_FEE_CENTS,
          currency: MARKETPLACE_CURRENCY,
        },
      });

      const updatedTeacher = await txdb.teacherProfile.update({
        where: { userId: user.profile.id },
        data: {
          registrationFeePaidAt: new Date(),
          verificationStatus: 'approved',
          isActive: true,
        },
      });

      return { status: 'paid' as const, teacher: updatedTeacher };
    });

    if (result.status === 'missing_teacher') {
      return NextResponse.json({ error: 'Create your teacher profile first' }, { status: 400 });
    }

    if (result.status === 'already_paid') {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        paidAt: result.paidAt,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Teacher registration fee paid (${formatCents(TEACHER_REGISTRATION_FEE_CENTS)}).`,
      teacher: result.teacher,
    });
  } catch (error) {
    console.error('Failed to complete teacher registration payment:', error);
    return NextResponse.json(
      { error: 'Failed to process registration fee', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

