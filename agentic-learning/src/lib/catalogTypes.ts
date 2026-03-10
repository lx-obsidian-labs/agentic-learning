export type SubjectDTO = {
  id: string;
  name: string;
  color: string;
  description: string;
  iconKey: string;
  courseCount: number;
};

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCardDTO = {
  id: string;
  subjectId: string;
  title: string;
  grade: number;
  description: string;
  difficulty: CourseDifficulty;
  estimatedHours: number;
  thumbnailUrl: string;
  instructorName: string;
  moduleCount: number;
  lessonCount: number;
};

export type LessonDTO = {
  id: string;
  title: string;
  duration: string;
  youtubeVideoId: string;
  notesMarkdown: string;
  keyPoints: string[];
  timestamps: { time: string; label: string }[];
  videoQuality: 'must-watch' | 'supplementary';
  // Compatibility fields for current UI:
  videoId: string;
  notes: string;
};

export type LessonCardDTO = {
  id: string;
  title: string;
  duration: string;
  videoQuality: 'must-watch' | 'supplementary';
  subjectId: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  keyPoints: string[];
};

export type LessonDetailDTO = LessonCardDTO & {
  youtubeVideoId: string;
  notesMarkdown: string;
  timestamps: { time: string; label: string }[];
};

export type ModuleDTO = {
  id: string;
  title: string;
  lessons: LessonDTO[];
};

export type CourseDTO = {
  id: string;
  subjectId: string;
  title: string;
  grade: number;
  description: string;
  difficulty: CourseDifficulty;
  modules: ModuleDTO[];
  instructorName: string;
  estimatedHours: number;
  thumbnailUrl: string;
  // Compatibility fields for current UI:
  subject: string;
  instructor: string;
  thumbnail: string;
};
