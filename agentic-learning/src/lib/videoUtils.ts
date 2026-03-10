/* eslint-disable @typescript-eslint/no-explicit-any */
import { CURATED_VIDEOS } from './curatedVideos';
import { INTERNATIONAL_EDUCATIONAL_VIDEOS, ADDITIONAL_MATH_VIDEOS } from './supplementaryVideos';
import { getVideoMetadata, searchEducationalVideos, formatDuration } from './videoService';

export interface VideoSource {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  channel: string;
  duration: string;
  subject: string;
  grade: number;
  topic: string;
  videoQuality: 'must-watch' | 'supplementary';
}

const ALL_VIDEOS = [...CURATED_VIDEOS, ...INTERNATIONAL_EDUCATIONAL_VIDEOS, ...ADDITIONAL_MATH_VIDEOS];

export function getAllVideos(): VideoSource[] {
  return ALL_VIDEOS;
}

export function getVideosBySubject(subjectId: string): VideoSource[] {
  return ALL_VIDEOS.filter(v => v.subject === subjectId);
}

export function getVideosByGrade(grade: number): VideoSource[] {
  return ALL_VIDEOS.filter(v => v.grade === grade);
}

export function getVideosByTopic(topic: string): VideoSource[] {
  return ALL_VIDEOS.filter(v => v.topic.toLowerCase() === topic.toLowerCase());
}

export function searchAllVideos(query: string): VideoSource[] {
  const queryLower = query.toLowerCase();
  return ALL_VIDEOS.filter(video => 
    video.title.toLowerCase().includes(queryLower) ||
    video.description.toLowerCase().includes(queryLower) ||
    video.topic.toLowerCase().includes(queryLower) ||
    video.subject.toLowerCase().includes(queryLower) ||
    video.channel.toLowerCase().includes(queryLower)
  );
}

export function getVideoById(id: string): VideoSource | undefined {
  return ALL_VIDEOS.find(v => v.id === id);
}

export function getVideoByYoutubeId(youtubeId: string): VideoSource | undefined {
  return ALL_VIDEOS.find(v => v.youtubeId === youtubeId);
}

export async function getEnhancedVideoInfo(youtubeId: string): Promise<{
  local: VideoSource | undefined;
  metadata: any;
  recommendations: VideoSource[];
}> {
  const local = getVideoByYoutubeId(youtubeId);
  
  let metadata = null;
  try {
    metadata = await getVideoMetadata(youtubeId);
  } catch (e) {
    console.warn('Failed to get video metadata:', e);
  }

  const recommendations = local 
    ? ALL_VIDEOS.filter(v => v.subject === local.subject && v.id !== local.id).slice(0, 5)
    : ALL_VIDEOS.slice(0, 5);

  return {
    local,
    metadata,
    recommendations
  };
}

export async function getRelatedVideos(
  subject: string, 
  topic: string, 
  excludeId?: string
): Promise<VideoSource[]> {
  const subjectVideos = getVideosBySubject(subject);
  const topicVideos = subjectVideos.filter(v => 
    v.topic.toLowerCase() === topic.toLowerCase()
  );
  
  let videos = topicVideos.length > 0 ? topicVideos : subjectVideos;
  
  if (excludeId) {
    videos = videos.filter(v => v.id !== excludeId);
  }
  
  return videos.slice(0, 6);
}

export async function searchAllSources(
  query: string,
  options: { subject?: string; grade?: number; limit?: number } = {}
): Promise<{
  local: VideoSource[];
  external: any[];
}> {
  const { subject, grade, limit = 10 } = options;
  
  let localResults = searchAllVideos(query);
  
  if (subject) {
    localResults = localResults.filter(v => v.subject === subject);
  }
  if (grade) {
    localResults = localResults.filter(v => v.grade === grade);
  }

  let externalResults: any[] = [];
  try {
    const searchResults = await searchEducationalVideos(query, {
      subject,
      grade,
      limit
    });
    externalResults = searchResults.videos;
  } catch (e) {
    console.warn('External search failed:', e);
  }

  return {
    local: localResults.slice(0, limit),
    external: externalResults
  };
}

export const VIDEO_SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', color: '#3B82F6' },
  { id: 'physical-sciences', name: 'Physical Sciences', color: '#EF4444' },
  { id: 'life-sciences', name: 'Life Sciences', color: '#22C55E' },
  { id: 'geography', name: 'Geography', color: '#8B5CF6' },
  { id: 'accounting', name: 'Accounting', color: '#F59E0B' },
  { id: 'economics', name: 'Economics', color: '#06B6D4' },
  { id: 'history', name: 'History', color: '#DC2626' },
  { id: 'business-studies', name: 'Business Studies', color: '#0891B2' },
  { id: 'computer-science', name: 'Computer Science', color: '#7C3AED' }
];

export const VIDEO_TOPICS: Record<string, string[]> = {
  'mathematics': ['Calculus', 'Algebra', 'Trigonometry', 'Geometry', 'Probability', 'Statistics', 'Finance'],
  'physical-sciences': ['Mechanics', 'Waves', 'Optics', 'Electricity', 'Chemistry', 'Matter'],
  'life-sciences': ['Cells', 'Genetics', 'Evolution', 'Ecology', 'Human Biology'],
  'geography': ['Climate', 'Tectonics', 'Resources', 'Settlements'],
  'accounting': ['Statements', 'Costing', 'Budgeting', 'Analysis'],
  'economics': ['Microeconomics', 'Macroeconomics', 'Markets', 'Policy'],
  'history': ['South Africa', 'World', 'Politics'],
  'business-studies': ['Management', 'Marketing', 'Organizations'],
  'computer-science': ['Programming', 'Algorithms', 'Web Development']
};

export function getVideoCountBySubject(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const video of ALL_VIDEOS) {
    counts[video.subject] = (counts[video.subject] || 0) + 1;
  }
  return counts;
}

export {
  formatDuration,
  getVideoMetadata,
  searchEducationalVideos
};
