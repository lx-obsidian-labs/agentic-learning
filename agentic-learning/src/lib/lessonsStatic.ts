import 'server-only';

import { courses, type Course, type Lesson } from '@/data/courses';
import type { LessonCardDTO, LessonDetailDTO } from '@/lib/catalogTypes';

type LessonContext = {
  lesson: Lesson;
  course: Course;
  module: Course['modules'][number];
};

let cachedById: Map<string, LessonContext> | null = null;

function getIndex(): Map<string, LessonContext> {
  if (cachedById) return cachedById;
  const byId = new Map<string, LessonContext>();
  for (const course of courses) {
    for (const courseModule of course.modules) {
      for (const lesson of courseModule.lessons) {
        byId.set(lesson.id, { lesson, course, module: courseModule });
      }
    }
  }
  cachedById = byId;
  return byId;
}

function toCard(ctx: LessonContext): LessonCardDTO {
  return {
    id: ctx.lesson.id,
    title: ctx.lesson.title,
    duration: ctx.lesson.duration,
    videoQuality: ctx.lesson.videoQuality,
    subjectId: ctx.course.subject,
    courseId: ctx.course.id,
    courseTitle: ctx.course.title,
    moduleId: ctx.module.id,
    moduleTitle: ctx.module.title,
    keyPoints: ctx.lesson.keyPoints,
  };
}

export function listLessonsByIdsStatic(ids: string[]): LessonCardDTO[] {
  const index = getIndex();
  const results: LessonCardDTO[] = [];
  for (const id of ids) {
    const ctx = index.get(id);
    if (!ctx) continue;
    results.push(toCard(ctx));
  }
  return results;
}

export function searchLessonsStatic(options: { query: string; subjectId?: string; limit: number }): LessonCardDTO[] {
  const query = options.query.trim().toLowerCase();
  if (query.length < 2) return [];

  const index = getIndex();
  const results: LessonCardDTO[] = [];

  for (const ctx of index.values()) {
    if (options.subjectId && ctx.course.subject !== options.subjectId) continue;

    const inTitle = ctx.lesson.title.toLowerCase().includes(query);
    const inKeyPoints = ctx.lesson.keyPoints.some((kp) => kp.toLowerCase().includes(query));
    const inNotes = ctx.lesson.notes.toLowerCase().includes(query);

    if (!inTitle && !inKeyPoints && !inNotes) continue;

    results.push(toCard(ctx));
    if (results.length >= options.limit) break;
  }

  return results;
}

export function getLessonByIdStatic(lessonId: string): LessonDetailDTO | null {
  const ctx = getIndex().get(lessonId);
  if (!ctx) return null;

  return {
    ...toCard(ctx),
    youtubeVideoId: ctx.lesson.videoId,
    notesMarkdown: ctx.lesson.notes,
    timestamps: ctx.lesson.timestamps,
  };
}
