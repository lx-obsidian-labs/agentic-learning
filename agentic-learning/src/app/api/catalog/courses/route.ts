import { NextResponse } from 'next/server';
import { listCourseCards } from '@/lib/catalog';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const subjectId = url.searchParams.get('subjectId') ?? undefined;
    const courses = await listCourseCards(subjectId);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
