import { NextResponse } from 'next/server';
import { listLessonsByIds } from '@/lib/lessons';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get('ids') ?? '';
  const seen = new Set<string>();
  const ids = raw
    .split(',')
    .map((id) => id.trim())
    .filter((id) => {
      if (!id) return false;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

  if (ids.length === 0) return NextResponse.json([]);
  return NextResponse.json(await listLessonsByIds(ids));
}

