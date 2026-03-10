import { NextResponse } from 'next/server';
import { getCourseById } from '@/lib/catalog';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  return NextResponse.json(course);
}
