import 'server-only';

import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { LessonCardDTO, LessonDetailDTO, LessonDTO } from '@/lib/catalogTypes';

function mapVideoQuality(value: 'must_watch' | 'supplementary'): LessonDTO['videoQuality'] {
  return value === 'supplementary' ? 'supplementary' : 'must-watch';
}

function mapTimestamps(value: Prisma.JsonValue | null): LessonDTO['timestamps'] {
  if (!value || typeof value !== 'object' || !Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const time = (item as Record<string, unknown>).time;
      const label = (item as Record<string, unknown>).label;
      if (typeof time !== 'string' || typeof label !== 'string') return null;
      return { time, label };
    })
    .filter((t): t is { time: string; label: string } => t !== null);
}

function mapDurationMinutes(value: number | null): string {
  if (!value || !Number.isFinite(value) || value <= 0) return '';
  return `${Math.round(value)} min`;
}

const lessonCardSelect = {
  slug: true,
  title: true,
  durationMinutes: true,
  videoQuality: true,
  keyPoints: true,
  module: {
    select: {
      slug: true,
      title: true,
      course: {
        select: {
          slug: true,
          title: true,
          status: true,
          subject: { select: { slug: true } },
        },
      },
    },
  },
} satisfies Prisma.LessonSelect;

type LessonCardRow = Prisma.LessonGetPayload<{ select: typeof lessonCardSelect }>;

const lessonDetailSelect = {
  ...lessonCardSelect,
  youtubeVideoId: true,
  notesMarkdown: true,
  timestamps: true,
} satisfies Prisma.LessonSelect;

function toCard(row: LessonCardRow): LessonCardDTO {
  return {
    id: row.slug,
    title: row.title,
    duration: mapDurationMinutes(row.durationMinutes),
    videoQuality: mapVideoQuality(row.videoQuality),
    subjectId: row.module.course.subject.slug,
    courseId: row.module.course.slug,
    courseTitle: row.module.course.title,
    moduleId: row.module.slug,
    moduleTitle: row.module.title,
    keyPoints: row.keyPoints,
  };
}

export async function listLessonsByIdsDb(ids: string[]): Promise<LessonCardDTO[]> {
  if (ids.length === 0) return [];

  const rows = await prisma.lesson.findMany({
    where: {
      slug: { in: ids },
      module: { course: { status: 'published' } },
    },
    select: lessonCardSelect,
  });

  const bySlug = new Map<string, LessonCardDTO>();
  for (const row of rows) bySlug.set(row.slug, toCard(row));

  const ordered: LessonCardDTO[] = [];
  for (const id of ids) {
    const item = bySlug.get(id);
    if (item) ordered.push(item);
  }
  return ordered;
}

export async function searchLessonsDb(options: {
  query: string;
  subjectId?: string;
  limit: number;
}): Promise<LessonCardDTO[]> {
  const query = options.query.trim();
  if (query.length < 2) return [];

  const rows = await prisma.lesson.findMany({
    where: {
      module: {
        course: {
          status: 'published',
          ...(options.subjectId ? { subject: { slug: options.subjectId } } : undefined),
        },
      },
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { notesMarkdown: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: options.limit,
    select: lessonCardSelect,
  });

  return rows.map(toCard);
}

export async function getLessonByIdDb(lessonSlug: string): Promise<LessonDetailDTO | null> {
  const row = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      module: { course: { status: 'published' } },
    },
    select: lessonDetailSelect,
  });

  if (!row) return null;

  return {
    ...toCard(row),
    youtubeVideoId: row.youtubeVideoId ?? '',
    notesMarkdown: row.notesMarkdown,
    timestamps: mapTimestamps(row.timestamps as Prisma.JsonValue | null),
  };
}
