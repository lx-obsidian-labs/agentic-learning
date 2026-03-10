import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, rating, review } = body;

    if (!lessonId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating data' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Rating submitted successfully' 
    });

    response.cookies.set(
      `lecture_rating_${lessonId}`,
      JSON.stringify({ rating, review, timestamp: Date.now() }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365
      }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get('lessonId');

  if (!lessonId) {
    return NextResponse.json(
      { error: 'Lesson ID required' },
      { status: 400 }
    );
  }

  const ratingCookie = request.cookies.get(`lecture_rating_${lessonId}`);

  if (!ratingCookie) {
    return NextResponse.json({ rating: null });
  }

  try {
    const ratingData = JSON.parse(ratingCookie.value);
    return NextResponse.json(ratingData);
  } catch {
    return NextResponse.json({ rating: null });
  }
}
