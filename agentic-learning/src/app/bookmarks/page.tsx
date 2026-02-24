'use client';

import { useState } from 'react';
import Link from 'next/link';
import { courses } from '@/data/courses';
import { useProgress } from '@/hooks/useProgress';
import { ChevronLeft, Bookmark, Play, Clock, Trash2 } from 'lucide-react';
import { Lesson } from '@/data/courses';

function findLessonById(lessonId: string): { lesson: Lesson; courseId: string; moduleName: string } | null {
  for (const course of courses) {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return { lesson, courseId: course.id, moduleName: module.title };
      }
    }
  }
  return null;
}

export default function BookmarksPage() {
  const { progress, toggleBookmark } = useProgress();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const bookmarkedLessons = progress.bookmarks
    .map(id => findLessonById(id))
    .filter((item): item is { lesson: Lesson; courseId: string; moduleName: string } => item !== null);

  const filteredLessons = bookmarkedLessons.filter(item => {
    if (filter === 'completed') return progress.completedLessons.includes(item.lesson.id);
    if (filter === 'incomplete') return !progress.completedLessons.includes(item.lesson.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{bookmarkedLessons.length} saved lessons</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookmarkedLessons.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Save lessons you want to revisit later by clicking the bookmark icon
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All ({bookmarkedLessons.length})
              </button>
              <button
                onClick={() => setFilter('incomplete')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'incomplete' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                To Watch ({bookmarkedLessons.filter(l => !progress.completedLessons.includes(l.lesson.id)).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Completed ({bookmarkedLessons.filter(l => progress.completedLessons.includes(l.lesson.id)).length})
              </button>
            </div>

            <div className="space-y-4">
              {filteredLessons.map((item) => {
                const isCompleted = progress.completedLessons.includes(item.lesson.id);
                
                return (
                  <div 
                    key={item.lesson.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {isCompleted ? (
                          <Play className="w-5 h-5 text-green-600" />
                        ) : (
                          <Play className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.lesson.title}</h3>
                            <p className="text-sm text-gray-500">{item.moduleName}</p>
                          </div>
                          <button
                            onClick={() => toggleBookmark(item.lesson.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {item.lesson.duration}
                          </span>
                          {item.lesson.videoQuality === 'must-watch' && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              ⭐ Must Watch
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                        
                        <Link
                          href={`/course/${item.courseId}`}
                          className="inline-flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Go to Lesson →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
