import 'server-only';

import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { CourseCardDTO, CourseDTO, CourseDifficulty, LessonDTO, SubjectDTO } from '@/lib/catalogTypes';

function mapDifficulty(value: 'beginner' | 'intermediate' | 'advanced'): CourseDifficulty {
  switch (value) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Beginner';
  }
}

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

export async function listSubjectsDb(): Promise<SubjectDTO[]> {
  const [subjectRows, counts] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, slug: true, name: true, color: true, description: true, iconKey: true },
    }),
    prisma.course.groupBy({
      by: ['subjectId'],
      where: { status: 'published' },
      _count: { _all: true },
    }),
  ]);

  const courseCountBySubjectId = new Map<string, number>();
  for (const row of counts) courseCountBySubjectId.set(row.subjectId, row._count._all);

  return subjectRows.map((subject) => ({
    id: subject.slug,
    name: subject.name,
    color: subject.color,
    description: subject.description,
    iconKey: subject.iconKey,
    courseCount: courseCountBySubjectId.get(subject.id) ?? 0,
  }));
}

export async function listCourseCardsDb(subjectSlug?: string): Promise<CourseCardDTO[]> {
  const courses = await prisma.course.findMany({
    where: {
      status: 'published',
      ...(subjectSlug ? { subject: { slug: subjectSlug } } : null),
    },
    orderBy: [{ grade: 'desc' }, { title: 'asc' }],
    include: {
      subject: { select: { slug: true } },
      modules: {
        select: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  return courses.map((course) => {
    const lessonCount = course.modules.reduce((acc, m) => acc + m._count.lessons, 0);
    return {
      id: course.slug,
      subjectId: course.subject.slug,
      title: course.title,
      grade: course.grade,
      description: course.description,
      difficulty: mapDifficulty(course.difficulty),
      estimatedHours: course.estimatedHours,
      thumbnailUrl: course.thumbnailUrl ?? '',
      instructorName: course.instructorName ?? '',
      moduleCount: course.modules.length,
      lessonCount,
    };
  });
}

export async function getCourseByIdDb(courseSlug: string): Promise<CourseDTO | null> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      subject: { select: { slug: true } },
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!course || course.status !== 'published') return null;

  return {
    id: course.slug,
    subjectId: course.subject.slug,
    title: course.title,
    grade: course.grade,
    description: course.description,
    difficulty: mapDifficulty(course.difficulty),
    modules: course.modules.map((module) => ({
      id: module.slug,
      title: module.title,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.slug,
        title: lesson.title,
        duration: mapDurationMinutes(lesson.durationMinutes),
        youtubeVideoId: lesson.youtubeVideoId ?? '',
        notesMarkdown: lesson.notesMarkdown ?? '',
        keyPoints: lesson.keyPoints,
        timestamps: mapTimestamps(lesson.timestamps as Prisma.JsonValue | null),
        videoQuality: mapVideoQuality(lesson.videoQuality),
        // Compatibility fields for current UI:
        videoId: lesson.youtubeVideoId ?? '',
        notes: lesson.notesMarkdown ?? '',
      })),
    })),
    instructorName: course.instructorName ?? '',
    estimatedHours: course.estimatedHours,
    thumbnailUrl: course.thumbnailUrl ?? '',
    // Compatibility fields for current UI:
    subject: course.subject.slug,
    instructor: course.instructorName ?? '',
    thumbnail: course.thumbnailUrl ?? '',
  };
}
