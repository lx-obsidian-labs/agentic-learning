import { NextResponse } from 'next/server';
import { listSubjects } from '@/lib/catalog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const subjects = await listSubjects();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
