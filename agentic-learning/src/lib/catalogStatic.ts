import 'server-only';

import { courses, subjects, type Course, type Subject } from '@/data/courses';
import type { CourseCardDTO, CourseDTO, LessonDTO, ModuleDTO, SubjectDTO } from '@/lib/catalogTypes';

function courseToCard(course: Course): CourseCardDTO {
  const lessonCount = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return {
    id: course.id,
    subjectId: course.subject,
    title: course.title,
    grade: course.grade,
    description: course.description,
    difficulty: course.difficulty,
    estimatedHours: course.estimatedHours,
    thumbnailUrl: course.thumbnail,
    instructorName: course.instructor,
    moduleCount: course.modules.length,
    lessonCount,
  };
}

function lessonToDTO(lesson: Course['modules'][number]['lessons'][number]): LessonDTO {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    youtubeVideoId: lesson.videoId,
    notesMarkdown: lesson.notes,
    keyPoints: lesson.keyPoints,
    timestamps: lesson.timestamps,
    videoQuality: lesson.videoQuality,
    videoId: lesson.videoId,
    notes: lesson.notes,
  };
}

function moduleToDTO(module: Course['modules'][number]): ModuleDTO {
  return {
    id: module.id,
    title: module.title,
    lessons: module.lessons.map(lessonToDTO),
  };
}

function courseToDTO(course: Course): CourseDTO {
  return {
    id: course.id,
    subjectId: course.subject,
    title: course.title,
    grade: course.grade,
    description: course.description,
    difficulty: course.difficulty,
    modules: course.modules.map(moduleToDTO),
    instructorName: course.instructor,
    estimatedHours: course.estimatedHours,
    thumbnailUrl: course.thumbnail,
    subject: course.subject,
    instructor: course.instructor,
    thumbnail: course.thumbnail,
  };
}

export function listSubjectsStatic(): SubjectDTO[] {
  const countBySubject = new Map<string, number>();
  for (const course of courses) {
    countBySubject.set(course.subject, (countBySubject.get(course.subject) ?? 0) + 1);
  }

  return subjects.map((subject: Subject) => ({
    id: subject.id,
    name: subject.name,
    color: subject.color,
    description: subject.description,
    iconKey: subject.icon,
    courseCount: countBySubject.get(subject.id) ?? 0,
  }));
}

export function listCourseCardsStatic(subjectId?: string): CourseCardDTO[] {
  const filtered = subjectId ? courses.filter((c) => c.subject === subjectId) : courses;
  return filtered.map(courseToCard);
}

export function getCourseByIdStatic(courseId: string): CourseDTO | null {
  const course = courses.find((c) => c.id === courseId);
  return course ? courseToDTO(course) : null;
}
