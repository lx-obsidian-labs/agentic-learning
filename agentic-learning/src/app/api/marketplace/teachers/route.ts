import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { asMarketplaceDb, ensureMarketplaceDb } from '@/lib/marketplaceDb';
import { requireUserProfile } from '@/lib/marketplace';

export const runtime = 'nodejs';

const ServiceSchema = z.object({
  mode: z.enum(['online', 'in_person']),
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(10).max(2500).optional(),
  subjectSlug: z.string().trim().min(2).max(80).optional(),
  rateCents: z.number().int().min(5_000).max(500_000),
  sessionMinutes: z.number().int().min(30).max(180).default(60),
  city: z.string().trim().min(2).max(100).optional(),
  inPersonArea: z.string().trim().min(2).max(120).optional(),
  onlinePlatform: z.string().trim().min(2).max(80).optional(),
});

const UpsertTeacherSchema = z.object({
  headline: z.string().trim().min(3).max(120),
  bio: z.string().trim().min(20).max(4000),
  hourlyRateCents: z.number().int().min(5_000).max(500_000),
  service: ServiceSchema.optional(),
});

export async function GET(request: Request) {
  try {
    const marketplaceDb = ensureMarketplaceDb();
    const url = new URL(request.url);
    const mode = url.searchParams.get('mode');
    const subject = url.searchParams.get('subject');
    const query = (url.searchParams.get('query') ?? '').trim();
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get('limit') ?? 20)));

    const serviceWhere: Record<string, unknown> = { isActive: true };
    if (mode === 'online' || mode === 'in_person') serviceWhere.mode = mode;
    if (subject) serviceWhere.subjectSlug = subject;
    if (query.length >= 2) {
      serviceWhere.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { subjectSlug: { contains: query, mode: 'insensitive' } },
      ];
    }

    const teachers = (await marketplaceDb.teacherProfile.findMany({
      where: {
        isActive: true,
        verificationStatus: 'approved',
        services: { some: serviceWhere },
      },
      include: {
        user: { select: { displayName: true } },
        services: {
          where: serviceWhere,
          orderBy: [{ mode: 'asc' }, { rateCents: 'asc' }],
        },
        _count: {
          select: {
            teacherBookings: true,
            reviewsReceived: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    })) as Array<Record<string, unknown>>;

    return NextResponse.json({ teachers });
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  ensureMarketplaceDb();
  const user = await requireUserProfile();
  if ('error' in user) return NextResponse.json({ error: user.error }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = UpsertTeacherSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const teacherPayload = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const txdb = asMarketplaceDb(tx);

      await tx.userProfile.update({
        where: { id: user.profile.id },
        data: { role: 'teacher' },
      });

      await txdb.teacherProfile.upsert({
        where: { userId: user.profile.id },
        create: {
          userId: user.profile.id,
          headline: teacherPayload.headline,
          bio: teacherPayload.bio,
          hourlyRateCents: teacherPayload.hourlyRateCents,
          verificationStatus: 'pending',
          isActive: false,
        },
        update: {
          headline: teacherPayload.headline,
          bio: teacherPayload.bio,
          hourlyRateCents: teacherPayload.hourlyRateCents,
        },
      });

      if (teacherPayload.service) {
        await txdb.teacherService.create({
          data: {
            teacherId: user.profile.id,
            mode: teacherPayload.service.mode,
            title: teacherPayload.service.title,
            description: teacherPayload.service.description,
            subjectSlug: teacherPayload.service.subjectSlug,
            rateCents: teacherPayload.service.rateCents,
            sessionMinutes: teacherPayload.service.sessionMinutes,
            city: teacherPayload.service.city,
            inPersonArea: teacherPayload.service.inPersonArea,
            onlinePlatform: teacherPayload.service.onlinePlatform,
            isActive: true,
          },
        });
      }

      return txdb.teacherProfile.findUnique({
        where: { userId: user.profile.id },
        include: {
          services: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    return NextResponse.json({ teacher: result });
  } catch (error) {
    console.error('Failed to upsert teacher profile:', error);
    return NextResponse.json(
      { error: 'Failed to save teacher profile', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
