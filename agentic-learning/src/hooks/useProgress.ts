'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserProgress {
  completedLessons: string[];
  points: number;
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  totalTimeSpent: number;
  totalWatchTime: number;
  videosWatched: number;
  quizzesTaken: number;
  badges: string[];
  quizScores: { lessonId: string; score: number; total: number; timestamp: number }[];
  bookmarks: string[];
  dailyChallenges: { id: string; completed: boolean; progress: number; target: number }[];
  region: string;
  grade: number;
  settings: {
    darkMode: boolean;
    notifications: boolean;
    autoplay: boolean;
    playbackSpeed: number;
  };
  analytics: StudentAnalytics;
  lectureRatings: Record<string, { rating: number; review: string; timestamp: number }>;
}

export interface StudentAnalytics {
  totalStudyTime: number;
  averageQuizScore: number;
  strongestTopic: string;
  weakestTopic: string;
  weeklyProgress: { date: string; minutes: number; score: number }[];
  topicScores: Record<string, { attempts: number; correct: number; averageTime: number }>;
  learningStreak: number;
  totalSessions: number;
  averageSessionLength: number;
  masteredTopics: string[];
  needsReview: string[];
  adaptiveDifficulty: 'beginner' | 'intermediate' | 'advanced';
  spacedRepetitionData: Record<string, { nextReview: number; interval: number; easeFactor: number; reviews: number }>;
  activeRecallScore: number;
}

const STORAGE_KEY = 'agentic-learning-progress';

const defaultAnalytics: StudentAnalytics = {
  totalStudyTime: 0,
  averageQuizScore: 0,
  strongestTopic: '',
  weakestTopic: '',
  weeklyProgress: [],
  topicScores: {},
  learningStreak: 0,
  totalSessions: 0,
  averageSessionLength: 0,
  masteredTopics: [],
  needsReview: [],
  adaptiveDifficulty: 'beginner',
  spacedRepetitionData: {},
  activeRecallScore: 0
};

const defaultProgress: UserProgress = {
  completedLessons: [],
  points: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: '',
  totalTimeSpent: 0,
  totalWatchTime: 0,
  videosWatched: 0,
  quizzesTaken: 0,
  badges: [],
  quizScores: [],
  bookmarks: [],
  region: 'gauteng',
  grade: 12,
  dailyChallenges: [
    { id: 'daily_lesson', completed: false, progress: 0, target: 1 },
    { id: 'daily_quiz', completed: false, progress: 0, target: 1 },
    { id: 'daily_study', completed: false, progress: 0, target: 15 },
    { id: 'daily_repeat', completed: false, progress: 0, target: 3 },
    { id: 'daily_watch', completed: false, progress: 0, target: 30 },
  ],
  settings: {
    darkMode: false,
    notifications: true,
    autoplay: true,
    playbackSpeed: 1
  },
  analytics: defaultAnalytics,
  lectureRatings: {}
};

function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2100) return 6;
  if (xp < 2800) return 7;
  if (xp < 3600) return 8;
  if (xp < 4500) return 9;
  return Math.floor(xp / 500) + 9;
}

function getXpForNextLevel(level: number): number {
  const thresholds = [100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000];
  return thresholds[Math.min(level - 1, thresholds.length - 1)];
}

function getLevelTitle(level: number): string {
  const titles = [
    'Novice Learner', 'Apprentice', 'Student', 'Scholar',
    'Expert', 'Master', 'Guru', 'Sage', 'Wizard', 'Legend',
    'Champion', 'Hero', 'Titan', 'Mythic', 'Divine', 'Omniscient'
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
}

function analyzeTopicFromLesson(lessonId: string): string {
  const topics: Record<string, string[]> = {
    'mathematics': ['calculus', 'algebra', 'probability', 'sequences', 'binomial', 'finance'],
    'physics': ['mechanics', 'newtons-laws', 'momentum', 'work-energy', 'wave', 'electric', 'magnetism'],
    'chemistry': ['equilibrium', 'acid-base', 'electrochemistry'],
    'biology': ['dna', 'genetics', 'protein-synthesis', 'nervous', 'excretory', 'immune'],
    'geography': ['weathering', 'drainage', 'climate', 'geomorphology']
  };
  
  for (const [topic, lessons] of Object.entries(topics)) {
    if (lessons.some(l => lessonId.includes(l))) {
      return topic;
    }
  }
  return 'general';
}

function calculateAdaptiveDifficulty(analytics: StudentAnalytics): 'beginner' | 'intermediate' | 'advanced' {
  if (analytics.averageQuizScore >= 85) return 'advanced';
  if (analytics.averageQuizScore >= 70) return 'intermediate';
  return 'beginner';
}

function updateSpacedRepetition(
  data: Record<string, { nextReview: number; interval: number; easeFactor: number; reviews: number }>,
  topic: string,
  correct: boolean
): Record<string, { nextReview: number; interval: number; easeFactor: number; reviews: number }> {
  const current = data[topic] || { nextReview: 0, interval: 1, easeFactor: 2.5, reviews: 0 };
  const now = Date.now();
  
  let newInterval: number;
  let newEaseFactor = current.easeFactor;
  
  if (correct) {
    if (current.reviews === 0) {
      newInterval = 1;
    } else if (current.reviews === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(current.interval * newEaseFactor);
    }
    newEaseFactor = Math.max(1.3, newEaseFactor + 0.1);
  } else {
    newInterval = 1;
    newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
  }
  
  const nextReview = now + newInterval * 24 * 60 * 60 * 1000;
  
  return {
    ...data,
    [topic]: {
      nextReview,
      interval: newInterval,
      easeFactor: newEaseFactor,
      reviews: current.reviews + 1
    }
  };
}

function getTopicsForReview(analytics: StudentAnalytics): string[] {
  const now = Date.now();
  const topicsDue: string[] = [];
  
  for (const [topic, data] of Object.entries(analytics.spacedRepetitionData)) {
    if (data.nextReview <= now) {
      topicsDue.push(topic);
    }
  }
  
  return topicsDue.length > 0 ? topicsDue : analytics.needsReview.slice(0, 3);
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionStart] = useState(Date.now());

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        const lastDate = parsed.lastStudyDate;
        
        if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastDate !== today && lastDate !== yesterdayStr) {
            parsed.streak = 0;
          }
        }
        
        if (!parsed.bookmarks) parsed.bookmarks = [];
        if (!parsed.dailyChallenges) parsed.dailyChallenges = defaultProgress.dailyChallenges;
        if (!parsed.region) parsed.region = defaultProgress.region;
        if (!parsed.grade) parsed.grade = defaultProgress.grade;
        if (!parsed.settings) {
          parsed.settings = {
            darkMode: false,
            notifications: true,
            autoplay: true,
            playbackSpeed: 1
          };
        }
        if (!parsed.analytics) parsed.analytics = defaultAnalytics;
        
        setProgress(parsed);
      } catch {
        setProgress(defaultProgress);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const completeLesson = (lessonId: string, _courseId: string) => {
    if (progress.completedLessons.includes(lessonId)) return;
    
    const today = new Date().toISOString().split('T')[0];
    const lastDate = progress.lastStudyDate;
    
    let newStreak = progress.streak;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        newStreak = progress.streak + 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }
    }
    
    const newPoints = progress.points + 10;
    const newXp = progress.xp + 25;
    const newLevel = calculateLevel(newXp);
    const newBadges = [...progress.badges];
    
    const dailyChallenges = progress.dailyChallenges 
      ? [...progress.dailyChallenges].map(c => {
          if (c.id === 'daily_lesson' && !c.completed) {
            return { ...c, progress: c.progress + 1, completed: c.progress + 1 >= c.target };
          }
          if (c.id === 'daily_study' && !c.completed) {
            return { ...c, progress: c.progress + 5, completed: c.progress + 5 >= c.target };
          }
          return c;
        })
      : [];
    
    if (newPoints >= 50 && !newBadges.includes('first_lesson')) {
      newBadges.push('first_lesson');
    }
    if (newPoints >= 100 && !newBadges.includes('quick_learner')) {
      newBadges.push('quick_learner');
    }
    if (newStreak >= 7 && !newBadges.includes('week_streak')) {
      newBadges.push('week_streak');
    }
    if (progress.completedLessons.length >= 10 && !newBadges.includes('dedicated')) {
      newBadges.push('dedicated');
    }
    if (newStreak >= 30 && !newBadges.includes('month_master')) {
      newBadges.push('month_master');
    }
    if (progress.analytics.averageQuizScore >= 90 && !newBadges.includes('high_achiever')) {
      newBadges.push('high_achiever');
    }
    if (newLevel > progress.level && !newBadges.includes('level_up')) {
      newBadges.push('level_up');
    }
    
    setProgress({
      ...progress,
      completedLessons: [...progress.completedLessons, lessonId],
      points: newPoints,
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastStudyDate: today,
      badges: newBadges,
      dailyChallenges
    });
  };

  const addQuizScore = (lessonId: string, score: number, total: number) => {
    const topic = analyzeTopicFromLesson(lessonId);
    const percentage = (score / total) * 100;
    const isPassing = percentage >= 80;
    
    const existingQuiz = progress.quizScores.find(q => q.lessonId === lessonId);
    let newScores = [...progress.quizScores, { lessonId, score, total, timestamp: Date.now() }];
    let pointsGained = 0;
    
    if (existingQuiz) {
      if (score > existingQuiz.score) {
        pointsGained = (score - existingQuiz.score) * 2;
        newScores = progress.quizScores.map(q => 
          q.lessonId === lessonId ? { lessonId, score, total, timestamp: Date.now() } : q
        );
      }
    } else {
      pointsGained = score * 2;
    }
    
    const topicScores = progress.analytics.topicScores[topic] || { attempts: 0, correct: 0, averageTime: 0 };
    const newTopicScores = {
      ...progress.analytics.topicScores,
      [topic]: {
        attempts: topicScores.attempts + 1,
        correct: topicScores.correct + (isPassing ? 1 : 0),
        averageTime: (topicScores.averageTime + 5) / 2
      }
    };
    
    const allScores = newScores.map(s => (s.score / s.total) * 100);
    const averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    
    const topicPerformance: Record<string, number> = {};
    for (const [t, data] of Object.entries(newTopicScores)) {
      topicPerformance[t] = data.correct / data.attempts * 100;
    }
    
    const sortedTopics = Object.entries(topicPerformance).sort((a, b) => b[1] - a[1]);
    const strongest = sortedTopics[0]?.[0] || '';
    const weakest = sortedTopics[sortedTopics.length - 1]?.[0] || '';
    
    const mastered = Object.entries(topicPerformance)
      .filter(([, score]) => score >= 80)
      .map(([topic]) => topic);
    
    const needsReview = Object.entries(topicPerformance)
      .filter(([, score]) => score < 60)
      .map(([topic]) => topic);
    
    const spacedData = updateSpacedRepetition(
      progress.analytics.spacedRepetitionData,
      topic,
      isPassing
    );
    
    const activeRecallScore = (progress.analytics.activeRecallScore + percentage) / 2;
    
    const today = new Date().toISOString().split('T')[0];
    const weeklyProgress = [...progress.analytics.weeklyProgress];
    const todayEntry = weeklyProgress.find(w => w.date === today);
    
    if (todayEntry) {
      todayEntry.score = percentage;
    } else {
      weeklyProgress.push({ date: today, minutes: 0, score: percentage });
    }
    
    if (weeklyProgress.length > 7) {
      weeklyProgress.shift();
    }
    
    const newAnalytics: StudentAnalytics = {
      ...progress.analytics,
      averageQuizScore: Math.round(averageScore),
      strongestTopic: strongest,
      weakestTopic: weakest,
      topicScores: newTopicScores,
      masteredTopics: mastered,
      needsReview: needsReview,
      adaptiveDifficulty: calculateAdaptiveDifficulty({ ...progress.analytics, averageQuizScore: averageScore }),
      spacedRepetitionData: spacedData,
      activeRecallScore: Math.round(activeRecallScore),
      weeklyProgress,
      totalSessions: progress.analytics.totalSessions + 1
    };
    
    setProgress({
      ...progress,
      quizScores: newScores,
      points: progress.points + pointsGained,
      analytics: newAnalytics
    });
  };

  const addTimeSpent = (minutes: number) => {
    const sessionLength = (Date.now() - sessionStart) / 60000;
    const avgSession = (progress.analytics.averageSessionLength * progress.analytics.totalSessions + sessionLength) / (progress.analytics.totalSessions + 1);
    
    const today = new Date().toISOString().split('T')[0];
    const weeklyProgress = [...progress.analytics.weeklyProgress];
    const todayEntry = weeklyProgress.find(w => w.date === today);
    
    if (todayEntry) {
      todayEntry.minutes += minutes;
    } else {
      weeklyProgress.push({ date: today, minutes, score: 0 });
    }
    
    setProgress({
      ...progress,
      totalTimeSpent: progress.totalTimeSpent + minutes,
      analytics: {
        ...progress.analytics,
        totalStudyTime: progress.analytics.totalStudyTime + minutes,
        weeklyProgress: weeklyProgress.slice(-7),
        averageSessionLength: Math.round(avgSession)
      }
    });
  };

  const addWatchTime = (secondsWatched: number, lessonId: string) => {
    const minutesWatched = Math.floor(secondsWatched / 60);
    if (minutesWatched < 1) return;
    
    const today = new Date().toISOString().split('T')[0];
    const weeklyProgress = [...progress.analytics.weeklyProgress];
    const todayEntry = weeklyProgress.find(w => w.date === today);
    
    if (todayEntry) {
      todayEntry.minutes += minutesWatched;
    } else {
      weeklyProgress.push({ date: today, minutes: minutesWatched, score: 0 });
    }
    
    const isNewVideo = !progress.completedLessons.includes(lessonId + '_watched');

    const dailyChallenges = progress.dailyChallenges
      ? [...progress.dailyChallenges].map(c => {
          if (c.id === 'daily_watch' && !c.completed) {
            const newProgress = c.progress + minutesWatched;
            return { ...c, progress: newProgress, completed: newProgress >= c.target };
          }
          return c;
        })
      : [];
    
    setProgress({
      ...progress,
      totalWatchTime: progress.totalWatchTime + minutesWatched,
      videosWatched: isNewVideo ? progress.videosWatched + 1 : progress.videosWatched,
      analytics: {
        ...progress.analytics,
        totalStudyTime: progress.analytics.totalStudyTime + minutesWatched,
        weeklyProgress: weeklyProgress.slice(-7),
      },
      completedLessons: isNewVideo ? [...progress.completedLessons, lessonId + '_watched'] : progress.completedLessons,
      dailyChallenges
    });
  };

  const getWatchTimeFormatted = () => {
    const hours = Math.floor(progress.totalWatchTime / 60);
    const minutes = progress.totalWatchTime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getQuizScore = (lessonId: string) => {
    return progress.quizScores.find(q => q.lessonId === lessonId);
  };

  const isLessonUnlocked = (lessonId: string, courseLessons: string[], currentIndex: number) => {
    if (currentIndex === 0) return true;
    
    const previousLessonId = courseLessons[currentIndex - 1];
    const previousQuiz = progress.quizScores.find(q => q.lessonId === previousLessonId);
    
    if (!previousQuiz) return false;
    
    const percentage = (previousQuiz.score / previousQuiz.total) * 100;
    return percentage >= 80;
  };

  const getQuizForDifficulty = (_lessonTitle: string): { difficulty: number; count: number } => {
    const difficulty = progress.analytics.adaptiveDifficulty;
    
    switch (difficulty) {
      case 'advanced':
        return { difficulty: 3, count: 8 };
      case 'intermediate':
        return { difficulty: 2, count: 6 };
      default:
        return { difficulty: 1, count: 5 };
    }
  };

  const getTopicsForReviewCallback = useCallback(() => {
    return getTopicsForReview(progress.analytics);
  }, [progress.analytics]);

  const getSpacedRepetitionTopics = useCallback(() => {
    return getTopicsForReview(progress.analytics);
  }, [progress.analytics]);

  const getLearningInsights = useCallback(() => {
    const insights: string[] = [];
    
    if (progress.streak >= 3) {
      insights.push(`🔥 You're on a ${progress.streak}-day streak! Keep it up!`);
    }
    
    if (progress.analytics.averageQuizScore >= 85) {
      insights.push('📈 Your performance is excellent! Ready for advanced content.');
    } else if (progress.analytics.averageQuizScore < 70) {
      insights.push('💡 Try reviewing the key concepts before moving on.');
    }
    
    if (progress.analytics.weakestTopic) {
      insights.push(`🎯 Focus on ${progress.analytics.weakestTopic} - it's your weakest area.`);
    }
    
    if (progress.analytics.needsReview.length > 0) {
      insights.push(`🔄 ${progress.analytics.needsReview.length} topics need review based on spaced repetition.`);
    }
    
    const dueCount = getTopicsForReview(progress.analytics).length;
    if (dueCount > 0) {
      insights.push(`📅 ${dueCount} topics are due for review today!`);
    }
    
    return insights;
  }, [progress.analytics, getTopicsForReview]);

  const getRecommendedLessons = useCallback(() => {
    const reviewTopics = getTopicsForReview(progress.analytics);
    if (reviewTopics.length > 0) {
      return reviewTopics;
    }
    return progress.analytics.needsReview;
  }, [progress.analytics, getTopicsForReview]);

  const toggleBookmark = (lessonId: string) => {
    const isBookmarked = progress.bookmarks.includes(lessonId);
    if (isBookmarked) {
      setProgress({
        ...progress,
        bookmarks: progress.bookmarks.filter(id => id !== lessonId)
      });
    } else {
      setProgress({
        ...progress,
        bookmarks: [...progress.bookmarks, lessonId]
      });
    }
  };

  const isBookmarked = (lessonId: string) => {
    return progress.bookmarks.includes(lessonId);
  };

  const updateSettings = (newSettings: Partial<UserProgress['settings']>) => {
    setProgress({
      ...progress,
      settings: { ...progress.settings, ...newSettings }
    });
  };

  const updateRegionAndGrade = (region: string, grade: number) => {
    setProgress({
      ...progress,
      region,
      grade
    });
  };

  const getLevelProgress = useCallback(() => {
    const currentLevelXp = progress.level === 1 ? 0 : getXpForNextLevel(progress.level - 1);
    const nextLevelXp = getXpForNextLevel(progress.level);
    const progressXp = progress.xp - currentLevelXp;
    const requiredXp = nextLevelXp - currentLevelXp;
    return {
      current: progressXp,
      required: requiredXp,
      percentage: Math.round((progressXp / requiredXp) * 100)
    };
  }, [progress.xp, progress.level]);

  const getLevelTitleLabel = useCallback(() => {
    return getLevelTitle(progress.level);
  }, [progress.level]);

  const getDailyChallenges = useCallback(() => {
    return progress.dailyChallenges || [];
  }, [progress.dailyChallenges]);

  const getLeaderboardPosition = useCallback(() => {
    return Math.floor(Math.random() * 100) + 1;
  }, []);

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  const rateLesson = useCallback((lessonId: string, rating: number, review: string = '') => {
    if (rating < 1 || rating > 5) return;
    
    setProgress(prev => ({
      ...prev,
      lectureRatings: {
        ...prev.lectureRatings,
        [lessonId]: { rating, review, timestamp: Date.now() }
      }
    }));
  }, []);

  const getLessonRating = useCallback((lessonId: string): { average: number; count: number } | null => {
    const ratings = Object.values(progress.lectureRatings);
    if (ratings.length === 0) return null;
    
    const average = Math.round(ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length);
    return { average, count: ratings.length };
  }, [progress.lectureRatings]);

  const getUserReview = useCallback((lessonId: string): { rating: number; review: string } | null => {
    const userRating = progress.lectureRatings[lessonId];
    if (!userRating) return null;
    return { rating: userRating.rating, review: userRating.review };
  }, [progress.lectureRatings]);

  return {
    progress,
    isLoaded,
    completeLesson,
    addQuizScore,
    addTimeSpent,
    addWatchTime,
    getWatchTimeFormatted,
    isLessonCompleted,
    getQuizScore,
    isLessonUnlocked,
    getQuizForDifficulty,
    getTopicsForReview: getTopicsForReviewCallback,
    getSpacedRepetitionTopics,
    getLearningInsights,
    getRecommendedLessons,
    toggleBookmark,
    isBookmarked,
    updateSettings,
    updateRegionAndGrade,
    getLevelProgress,
    getLevelTitleLabel,
    getDailyChallenges,
     getLeaderboardPosition,
     resetProgress,
     rateLesson,
     getLessonRating,
     getUserReview
   };
 }

export const badgeInfo: { id: string; name: string; icon: string; description: string; color: string; requirement: string }[] = [
  { id: 'first_lesson', name: 'First Step', icon: '🎯', description: 'Complete your first lesson', color: '#3B82F6', requirement: 'Complete 1 lesson' },
  { id: 'quick_learner', name: 'Quick Learner', icon: '⚡', description: 'Earn 100 points', color: '#F59E0B', requirement: 'Earn 100 points' },
  { id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: 'Study for 7 days in a row', color: '#EF4444', requirement: '7-day streak' },
  { id: 'dedicated', name: 'Dedicated', icon: '🏆', description: 'Complete 10 lessons', color: '#8B5CF6', requirement: 'Complete 10 lessons' },
  { id: 'month_master', name: 'Month Master', icon: '👑', description: 'Study for 30 days in a row', color: '#FFD700', requirement: '30-day streak' },
  { id: 'high_achiever', name: 'High Achiever', icon: '⭐', description: 'Maintain 90% average score', color: '#10B981', requirement: '90% quiz average' },
  { id: 'topic_master', name: 'Topic Master', icon: '🎓', description: 'Master 5 topics', color: '#6366F1', requirement: 'Master 5 topics' },
  { id: 'perfect_score', name: 'Perfect Score', icon: '💯', description: 'Get 100% on a quiz', color: '#EC4899', requirement: '100% on quiz' },
  { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Study before 7am', color: '#F97316', requirement: 'Morning study session' },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Study after 10pm', color: '#7C3AED', requirement: 'Late night study' },
];
