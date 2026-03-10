'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/components/ToastProvider';
import VideoPlayer from '@/components/VideoPlayer';
import NotesPanel from '@/components/NotesPanel';
import Quiz from '@/components/Quiz';
import ProgressDashboard from '@/components/ProgressDashboard';
import { LectureRatingSection } from '@/components/LectureRating';
import { ChevronLeft, Play, CheckCircle2, Clock, BookOpen, LayoutDashboard, Bookmark, GraduationCap } from 'lucide-react';
import type { CourseDTO } from '@/lib/catalogTypes';
import { getQuizForLesson } from '@/data/quizQuestions';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const { progress, completeLesson, addQuizScore, addWatchTime, getQuizScore, toggleBookmark, isBookmarked, isLessonUnlocked, resetProgress } = useProgress();
  const { warning } = useToast();

  const [course, setCourse] = useState<CourseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentLesson, setCurrentLesson] = useState<CourseDTO['modules'][number]['lessons'][number] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const checkQuizPassed = (lessonId: string): boolean => {
    const quizScore = getQuizScore(lessonId);
    if (!quizScore) return false;
    const percentage = (quizScore.score / quizScore.total) * 100;
    return percentage >= 80;
  };

  const handleNextLesson = () => {
    if (currentLesson && !checkQuizPassed(currentLesson.id)) {
      warning('Pass the quiz with 80% or higher to unlock the next lesson!');
      setShowQuiz(true);
      return;
    }
    const next = getNextLesson();
    if (next) {
      setCurrentLesson(next);
      setShowQuiz(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`/api/catalog/courses/${encodeURIComponent(courseId)}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load course');

        const data = await res.json();
        setCourse(data);
        if (data.modules?.[0]?.lessons?.[0]) {
          setCurrentLesson(data.modules[0].lessons[0]);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = course.modules.reduce((acc, mod) => 
    acc + mod.lessons.filter(l => progress.completedLessons.includes(l.id)).length, 0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleCompleteLesson = () => {
    if (currentLesson && !progress.completedLessons.includes(currentLesson.id)) {
      completeLesson(currentLesson.id, course.id);
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (currentLesson) {
      addQuizScore(currentLesson.id, score, total);
    }
    setShowQuiz(false);
  };

  const getNextLesson = () => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
      return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{course.title}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{completedCount}/{totalLessons} completed • {progressPercent}%</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">{course.instructor}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">{progress.streak} day streak</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{progress.points} pts</span>
              </div>
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  showDashboard
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">Progress</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDashboard ? (
          <ProgressDashboard 
            progress={progress} 
            totalLessons={totalLessons}
            onReset={resetProgress}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentLesson ? (
                <>
                  <VideoPlayer
                    videoId={currentLesson.videoId}
                    title={currentLesson.title}
                    timestamps={currentLesson.timestamps}
                    videoQuality={currentLesson.videoQuality}
                    playbackSpeed={progress.settings.playbackSpeed}
                    autoplay={progress.settings.autoplay}
                    onProgress={(seconds) => addWatchTime(seconds, currentLesson.id)}
                  />
                  
                   {showQuiz ? (
                     <Quiz
                       lessonId={currentLesson.id}
                       lessonTitle={currentLesson.title}
                       questions={getQuizForLesson(currentLesson.title)}
                       onComplete={handleQuizComplete}
                       onClose={() => setShowQuiz(false)}
                       existingScore={getQuizScore(currentLesson.id)}
                     />
                  ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{currentLesson.title}</h2>
                          <div className="flex items-center gap-4 mt-2 text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {currentLesson.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              Notes available
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {currentLesson && (
                            <button
                              onClick={() => toggleBookmark(currentLesson.id)}
                              className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                                isBookmarked(currentLesson.id)
                                  ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked(currentLesson.id) ? 'fill-yellow-500' : ''}`} />
                              {isBookmarked(currentLesson.id) ? 'Saved' : 'Save'}
                            </button>
                          )}
                          {progress.completedLessons.includes(currentLesson.id) ? (
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={handleCompleteLesson}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              Mark Complete
                            </button>
                          )}
                          {getNextLesson() && (
                            <button
                              onClick={handleNextLesson}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentLesson && !checkQuizPassed(currentLesson.id)
                                  ? 'border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {currentLesson && !checkQuizPassed(currentLesson.id) ? (
                                <>
                                  <span>⚠️ Quiz Required (80%)</span>
                                </>
                              ) : (
                                <span>Next Lesson →</span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {currentLesson && progress.completedLessons.includes(currentLesson.id) && (
                        <div className="mt-4">
                          <LectureRatingSection
                            lessonId={currentLesson.id}
                            lessonTitle={currentLesson.title}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!showQuiz && (
                    <NotesPanel
                      notes={currentLesson.notes}
                      keyPoints={currentLesson.keyPoints}
                      lessonTitle={currentLesson.title}
                    />
                  )}
                </>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                  <p className="text-gray-500">Select a lesson to start learning</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Course Content</h3>
                    <p className="text-sm text-gray-500">{course.modules.length} modules • {totalLessons} lessons</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{progressPercent}%</p>
                    <p className="text-xs text-gray-500">complete</p>
                  </div>
                </div>
                
                <div className="max-h-[500px] overflow-y-auto">
                  {course.modules.map((module, moduleIdx) => (
                    <div key={module.id} className="border-b border-gray-100 last:border-0">
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center">{moduleIdx + 1}</span>
                          {module.title}
                        </h4>
                      </div>
                      
                      <div>
                        {module.lessons.map((lesson, lessonIdx) => {
                          const allLessons = course.modules.flatMap(m => m.lessons);
                          const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
                          const isUnlocked = isLessonUnlocked(lesson.id, allLessons.map(l => l.id), lessonIndex);
                          const isCompleted = progress.completedLessons.includes(lesson.id);
                          const isCurrent = currentLesson?.id === lesson.id;
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                if (isUnlocked || isCompleted) {
                                  setCurrentLesson(lesson);
                                  setShowQuiz(false);
                                }
                              }}
                              disabled={!isUnlocked && !isCompleted}
                              className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                                isCurrent ? 'bg-blue-50' : isUnlocked || isCompleted ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-gray-50'
                              }`}
                            >
                              <div className={`mt-0.5 ${
                                isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : isUnlocked ? 'text-gray-400' : 'text-gray-300'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : isCurrent ? (
                                  <Play className="w-5 h-5" />
                                ) : isUnlocked ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-current" />
                                ) : (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm ${
                                  isCurrent ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">{lesson.duration}</span>
                                  {!isUnlocked && !isCompleted && (
                                    <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">🔒 80% required</span>
                                  )}
                                  {lesson.videoQuality === 'must-watch' && (
                                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">⭐</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-2">Keep Your Streak!</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Study every day to build your streak and earn badges.
                </p>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-bold">{progress.streak} days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Flame({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
