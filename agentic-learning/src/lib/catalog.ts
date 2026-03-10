import 'server-only';

import type { CourseCardDTO, CourseDTO, SubjectDTO } from '@/lib/catalogTypes';

function isDatabaseEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export async function listSubjects(): Promise<SubjectDTO[]> {
  if (isDatabaseEnabled()) {
    const { listSubjectsDb } = await import('@/lib/catalogDb');
    return listSubjectsDb();
  }
  const { listSubjectsStatic } = await import('@/lib/catalogStatic');
  return listSubjectsStatic();
}

export async function listCourseCards(subjectId?: string): Promise<CourseCardDTO[]> {
  if (isDatabaseEnabled()) {
    const { listCourseCardsDb } = await import('@/lib/catalogDb');
    return listCourseCardsDb(subjectId);
  }
  const { listCourseCardsStatic } = await import('@/lib/catalogStatic');
  return listCourseCardsStatic(subjectId);
}

export async function getCourseById(courseId: string): Promise<CourseDTO | null> {
  if (isDatabaseEnabled()) {
    const { getCourseByIdDb } = await import('@/lib/catalogDb');
    return getCourseByIdDb(courseId);
  }
  const { getCourseByIdStatic } = await import('@/lib/catalogStatic');
  return getCourseByIdStatic(courseId);
}
