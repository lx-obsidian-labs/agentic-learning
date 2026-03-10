import { PrismaClient } from '@prisma/client';
import { courses, subjects } from '../src/data/courses';

const prisma = new PrismaClient();

type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
type VideoQuality = 'must_watch' | 'supplementary';

function mapCourseDifficulty(value: string): CourseDifficulty {
  switch (value) {
    case 'Beginner':
      return 'beginner';
    case 'Intermediate':
      return 'intermediate';
    case 'Advanced':
      return 'advanced';
    default:
      return 'beginner';
  }
}

function mapVideoQuality(value: string): VideoQuality {
  return value === 'supplementary' ? 'supplementary' : 'must_watch';
}

function parseDurationToMinutes(value: string): number | null {
  const raw = value.trim().toLowerCase();
  if (!raw) return null;

  // Common patterns:
  // - "15m", "15 min", "15 minutes"
  // - "1h", "1 h", "1 hour", "1h 20m"
  const hourMatch = raw.match(/(\d+(?:\.\d+)?)\s*h/);
  const minMatch = raw.match(/(\d+(?:\.\d+)?)\s*m/);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const mins = minMatch ? Number(minMatch[1]) : 0;
  const total = Math.round(hours * 60 + mins);
  if (!Number.isFinite(total) || total <= 0) return null;
  return total;
}

async function main() {
  const subjectIdBySlug = new Map<string, string>();

  for (const [order, subject] of subjects.entries()) {
    const record = await prisma.subject.upsert({
      where: { slug: subject.id },
      update: {
        name: subject.name,
        color: subject.color,
        description: subject.description,
        iconKey: subject.icon,
        order,
      },
      create: {
        slug: subject.id,
        name: subject.name,
        color: subject.color,
        description: subject.description,
        iconKey: subject.icon,
        order,
      },
    });

    subjectIdBySlug.set(subject.id, record.id);
  }

  for (const course of courses) {
    const subjectId = subjectIdBySlug.get(course.subject);
    if (!subjectId) continue;

    const courseRecord = await prisma.course.upsert({
      where: { slug: course.id },
      update: {
        subjectId,
        title: course.title,
        grade: course.grade,
        description: course.description,
        difficulty: mapCourseDifficulty(course.difficulty),
        estimatedHours: Math.max(0, Math.round(course.estimatedHours)),
        thumbnailUrl: course.thumbnail || null,
        instructorName: course.instructor || null,
        status: 'published',
        publishedAt: new Date(),
      },
      create: {
        slug: course.id,
        subjectId,
        title: course.title,
        grade: course.grade,
        description: course.description,
        difficulty: mapCourseDifficulty(course.difficulty),
        estimatedHours: Math.max(0, Math.round(course.estimatedHours)),
        thumbnailUrl: course.thumbnail || null,
        instructorName: course.instructor || null,
        status: 'published',
        publishedAt: new Date(),
      },
    });

    for (const [moduleOrder, module] of course.modules.entries()) {
      const moduleRecord = await prisma.module.upsert({
        where: {
          courseId_slug: { courseId: courseRecord.id, slug: module.id },
        },
        update: {
          slug: module.id,
          title: module.title,
          order: moduleOrder,
        },
        create: {
          courseId: courseRecord.id,
          slug: module.id,
          title: module.title,
          order: moduleOrder,
        },
      });

      for (const [lessonOrder, lesson] of module.lessons.entries()) {
        await prisma.lesson.upsert({
          where: {
            moduleId_slug: { moduleId: moduleRecord.id, slug: lesson.id },
          },
          update: {
            slug: lesson.id,
            title: lesson.title,
            order: lessonOrder,
            durationMinutes: parseDurationToMinutes(lesson.duration),
            youtubeVideoId: lesson.videoId || null,
            videoQuality: mapVideoQuality(lesson.videoQuality),
            notesMarkdown: lesson.notes,
            keyPoints: lesson.keyPoints,
            timestamps: lesson.timestamps,
          },
          create: {
            moduleId: moduleRecord.id,
            slug: lesson.id,
            title: lesson.title,
            order: lessonOrder,
            durationMinutes: parseDurationToMinutes(lesson.duration),
            youtubeVideoId: lesson.videoId || null,
            videoQuality: mapVideoQuality(lesson.videoQuality),
            notesMarkdown: lesson.notes,
            keyPoints: lesson.keyPoints,
            timestamps: lesson.timestamps,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
