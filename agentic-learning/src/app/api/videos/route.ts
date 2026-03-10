import { NextRequest, NextResponse } from 'next/server';
import { searchEducationalVideos, getVideoMetadata } from '@/lib/videoService';
import { searchCuratedVideos, getCuratedVideosBySubject, getCuratedVideosByGrade } from '@/lib/curatedVideos';
import { SA_EDUCATIONAL_CHANNELS } from '@/lib/videoSources';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const query = searchParams.get('q') || '';
  const subject = searchParams.get('subject') || '';
  const grade = searchParams.get('grade');
  const source = searchParams.get('source') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20');
  const videoId = searchParams.get('videoId');

  try {
    if (videoId) {
      const metadata = await getVideoMetadata(videoId);
      if (!metadata) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(metadata);
    }

    const results: {
      curated?: import('@/lib/curatedVideos').CuratedVideo[];
      search?: import('@/lib/videoService').VideoMetadata[];
      channels?: typeof SA_EDUCATIONAL_CHANNELS;
    } = {};

    if (source === 'all' || source === 'curated') {
      let curatedResults = query 
        ? searchCuratedVideos(query)
        : subject 
          ? getCuratedVideosBySubject(subject)
          : grade 
            ? getCuratedVideosByGrade(parseInt(grade))
            : [];

      if (subject) {
        curatedResults = curatedResults.filter(v => v.subject === subject);
      }
      if (grade) {
        curatedResults = curatedResults.filter(v => v.grade === parseInt(grade));
      }

      results.curated = curatedResults.slice(0, limit);
    }

    if ((source === 'all' || source === 'search') && query) {
      try {
        const searchResults = await searchEducationalVideos(query, {
          subject: subject || undefined,
          grade: grade ? parseInt(grade) : undefined,
          limit
        });
        results.search = searchResults.videos;
      } catch (error) {
        console.error('Search failed:', error);
        results.search = [];
      }
    }

    if (source === 'channels') {
      results.channels = SA_EDUCATIONAL_CHANNELS;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Video API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
