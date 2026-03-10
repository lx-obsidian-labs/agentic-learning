import { NextResponse } from 'next/server';
import { getLessonById } from '@/lib/lessons';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = await getLessonById(lessonId);
  if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  return NextResponse.json(lesson);
}

