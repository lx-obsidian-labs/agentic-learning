import 'server-only';

import type { LessonCardDTO, LessonDetailDTO } from '@/lib/catalogTypes';

function isDatabaseEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export async function listLessonsByIds(ids: string[]): Promise<LessonCardDTO[]> {
  if (isDatabaseEnabled()) {
    const { listLessonsByIdsDb } = await import('@/lib/lessonsDb');
    return listLessonsByIdsDb(ids);
  }
  const { listLessonsByIdsStatic } = await import('@/lib/lessonsStatic');
  return listLessonsByIdsStatic(ids);
}

export async function searchLessons(options: {
  query: string;
  subjectId?: string;
  limit: number;
}): Promise<LessonCardDTO[]> {
  if (isDatabaseEnabled()) {
    const { searchLessonsDb } = await import('@/lib/lessonsDb');
    return searchLessonsDb(options);
  }
  const { searchLessonsStatic } = await import('@/lib/lessonsStatic');
  return searchLessonsStatic(options);
}

export async function getLessonById(lessonId: string): Promise<LessonDetailDTO | null> {
  if (isDatabaseEnabled()) {
    const { getLessonByIdDb } = await import('@/lib/lessonsDb');
    return getLessonByIdDb(lessonId);
  }
  const { getLessonByIdStatic } = await import('@/lib/lessonsStatic');
  return getLessonByIdStatic(lessonId);
}

