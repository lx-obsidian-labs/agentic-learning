/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRandomInvidiousInstance, INVIDIOUS_INSTANCES } from './videoSources';

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  tags: string[];
  category: string;
  source: string;
}

export interface VideoSearchResult {
  videos: VideoMetadata[];
  totalResults: number;
  source: string;
}

export interface CuratedVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  channel: string;
  channelId: string;
  duration: string;
  subject: string;
  grade: number;
  topic: string;
  videoQuality: 'must-watch' | 'supplementary';
  captions: boolean;
}

async function fetchWithFallback(urls: string[], options: RequestInit = {}): Promise<Response> {
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        ...options,
        next: { revalidate: 3600 }
      });
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
      continue;
    }
  }
  throw new Error('All fetch attempts failed');
}

export async function getVideoMetadataFromInvidious(videoId: string): Promise<VideoMetadata | null> {
  const instances = [...INVIDIOUS_INSTANCES];
  
  for (const baseUrl of instances) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/videos/${videoId}`, {
        next: { revalidate: 3600 }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      return {
        id: data.videoId,
        title: data.title,
        description: data.description,
        thumbnailUrl: data.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channelId: data.authorId,
        channelTitle: data.author,
        duration: data.lengthSeconds || 0,
        viewCount: data.viewCount || 0,
        likeCount: data.likeCount || 0,
        publishedAt: data.published,
        tags: data.tags || [],
        category: data.category || 'Education',
        source: baseUrl
      };
    } catch (error) {
      console.warn(`Invidious fetch failed for ${baseUrl}:`, error);
      continue;
    }
  }
  
  return null;
}

export async function getVideoMetadataFromNoembed(videoId: string): Promise<VideoMetadata | null> {
  try {
    const response = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return {
      id: videoId,
      title: data.title,
      description: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      channelId: '',
      channelTitle: data.author_name,
      duration: 0,
      viewCount: 0,
      likeCount: 0,
      publishedAt: '',
      tags: [],
      category: 'Education',
      source: 'noembed'
    };
  } catch (error) {
    console.warn('Noembed fetch failed:', error);
    return null;
  }
}

export async function getVideoMetadataFromYouTubeOembed(videoId: string): Promise<VideoMetadata | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return {
      id: videoId,
      title: data.title,
      description: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      channelId: '',
      channelTitle: data.author_name,
      duration: 0,
      viewCount: 0,
      likeCount: 0,
      publishedAt: '',
      tags: [],
      category: 'Education',
      source: 'youtube-oembed'
    };
  } catch (error) {
    console.warn('YouTube oEmbed fetch failed:', error);
    return null;
  }
}

export async function getVideoMetadata(videoId: string): Promise<VideoMetadata | null> {
  const metadata = await getVideoMetadataFromInvidious(videoId);
  if (metadata) return metadata;
  
  const noembed = await getVideoMetadataFromNoembed(videoId);
  if (noembed) return noembed;
  
  return getVideoMetadataFromYouTubeOembed(videoId);
}

export async function searchVideosFromInvidious(
  query: string,
  options: { channelId?: string; limit?: number; page?: number } = {}
): Promise<VideoSearchResult> {
  const { channelId, limit = 10, page = 1 } = options;
  const baseUrl = getRandomInvidiousInstance();
  
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      type: 'video'
    });
    
    if (channelId) {
      params.append('channelId', channelId);
    }
    
    const response = await fetch(`${baseUrl}/api/v1/search?${params}`, {
      next: { revalidate: 1800 }
    });
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    const videos: VideoMetadata[] = data.map((item: any) => ({
      id: item.videoId,
      title: item.title,
      description: item.description,
      thumbnailUrl: item.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`,
      channelId: item.channelId,
      channelTitle: item.author,
      duration: item.lengthSeconds || 0,
      viewCount: item.viewCount || 0,
      likeCount: item.likeCount || 0,
      publishedAt: item.published,
      tags: item.tags || [],
      category: item.type || 'video',
      source: baseUrl
    }));
    
    return {
      videos,
      totalResults: videos.length,
      source: baseUrl
    };
  } catch (error) {
    console.error('Invidious search failed:', error);
    return {
      videos: [],
      totalResults: 0,
      source: baseUrl
    };
  }
}

export async function searchEducationalVideos(
  query: string,
  options: { subject?: string; grade?: number; limit?: number } = {}
): Promise<VideoSearchResult> {
  const { subject, grade, limit = 20 } = options;
  
  let searchQuery = query;
  
  if (subject) {
    searchQuery = `${subject} ${query}`;
  }
  
  if (grade) {
    searchQuery = `Grade ${grade} ${searchQuery}`;
  }
  
  searchQuery = `${searchQuery} South Africa CAPS tutorial`;
  
  const result = await searchVideosFromInvidious(searchQuery, { limit });
  
  let filteredVideos = result.videos;
  
  if (subject || grade) {
    filteredVideos = result.videos.filter(video => {
      const titleLower = video.title.toLowerCase();
      const descLower = video.description?.toLowerCase() || '';
      
      if (subject && !titleLower.includes(subject.toLowerCase()) && !descLower.includes(subject.toLowerCase())) {
        return false;
      }
      
      if (grade && !titleLower.includes(`grade ${grade}`) && !titleLower.includes(`gr ${grade}`)) {
        return false;
      }
      
      return true;
    });
  }
  
  return {
    ...result,
    videos: filteredVideos,
    totalResults: filteredVideos.length
  };
}

export async function getChannelVideosFromInvidious(
  channelId: string,
  options: { limit?: number } = {}
): Promise<VideoSearchResult> {
  const { limit = 50 } = options;
  const baseUrl = getRandomInvidiousInstance();
  
  try {
    const response = await fetch(
      `${baseUrl}/api/v1/channels/${channelId}/videos?limit=${limit}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Channel videos failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    const videos: VideoMetadata[] = data.map((item: any) => ({
      id: item.videoId,
      title: item.title,
      description: item.description,
      thumbnailUrl: item.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`,
      channelId: item.channelId,
      channelTitle: item.author,
      duration: item.lengthSeconds || 0,
      viewCount: item.viewCount || 0,
      likeCount: item.likeCount || 0,
      publishedAt: item.published,
      tags: item.tags || [],
      category: item.type || 'video',
      source: baseUrl
    }));
    
    return {
      videos,
      totalResults: videos.length,
      source: baseUrl
    };
  } catch (error) {
    console.error('Invidious channel videos failed:', error);
    return {
      videos: [],
      totalResults: 0,
      source: baseUrl
    };
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
