import { NextResponse } from 'next/server';
import { courses, subjects } from '@/data/courses';

export const runtime = 'nodejs';

type SearchResult = {
  type: 'lesson' | 'course' | 'subject';
  id: string;
  title: string;
  subtitle: string;
  courseId?: string;
};

export function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get('query') ?? '').trim();
    const limitRaw = url.searchParams.get('limit');
    const limit = Math.max(1, Math.min(50, limitRaw ? Number(limitRaw) : 20));

    if (query.length < 2) return NextResponse.json([]);

    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];
    const seen = new Set<string>();

    const push = (item: SearchResult) => {
      const key = `${item.type}:${item.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      results.push(item);
    };

    for (const subject of subjects) {
      if (subject.name.toLowerCase().includes(searchTerm) || subject.description.toLowerCase().includes(searchTerm)) {
        push({
          type: 'subject',
          id: subject.id,
          title: subject.name,
          subtitle: subject.description,
        });
      }
    }

    for (const course of courses) {
      if (course.title.toLowerCase().includes(searchTerm) || course.description.toLowerCase().includes(searchTerm)) {
        push({
          type: 'course',
          id: course.id,
          title: course.title,
          subtitle: course.description,
        });
      }

      for (const courseModule of course.modules) {
        for (const lesson of courseModule.lessons) {
          if (
            lesson.title.toLowerCase().includes(searchTerm) ||
            lesson.keyPoints.some((kp) => kp.toLowerCase().includes(searchTerm))
          ) {
            push({
              type: 'lesson',
              id: lesson.id,
              title: lesson.title,
              subtitle: `${course.title} - ${courseModule.title}`,
              courseId: course.id,
            });
          }
        }
      }
    }

    return NextResponse.json(results.slice(0, limit));
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
