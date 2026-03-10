import { NextResponse } from 'next/server';
import { searchLessons } from '@/lib/lessons';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get('query') ?? '').trim();
  const subjectId = url.searchParams.get('subjectId') ?? undefined;
  const limitRaw = url.searchParams.get('limit');
  const limit = Math.max(1, Math.min(50, limitRaw ? Number(limitRaw) : 50));

  if (query.length < 2) return NextResponse.json([]);
  return NextResponse.json(await searchLessons({ query, subjectId, limit }));
}

