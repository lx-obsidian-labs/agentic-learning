'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { ChevronLeft, Bookmark, Play, Clock, Trash2 } from 'lucide-react';
import type { LessonCardDTO } from '@/lib/catalogTypes';

export default function BookmarksPage() {
  const { progress, toggleBookmark } = useProgress();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [lessons, setLessons] = useState<LessonCardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (progress.bookmarks.length === 0) {
      setLessons([]);
      setLoadError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({ ids: progress.bookmarks.join(',') });

    setIsLoading(true);
    setLoadError(null);

    fetch(`/api/catalog/lessons/by-ids?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load bookmarks (${res.status})`);
        const data = (await res.json()) as LessonCardDTO[];
        setLessons(data);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string } | null)?.name === 'AbortError') return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load bookmarks');
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [progress.bookmarks, reloadKey]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((item) => {
      if (filter === 'completed') return progress.completedLessons.includes(item.id);
      if (filter === 'incomplete') return !progress.completedLessons.includes(item.id);
      return true;
    });
  }, [filter, lessons, progress.completedLessons]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{lessons.length} saved lessons</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading bookmarks…</p>
          </div>
        ) : loadError ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Couldn&apos;t load bookmarks</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Save lessons you want to revisit later by clicking the bookmark icon.
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
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                All ({lessons.length})
              </button>
              <button
                onClick={() => setFilter('incomplete')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'incomplete'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                To Watch ({lessons.filter((l) => !progress.completedLessons.includes(l.id)).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                Completed ({lessons.filter((l) => progress.completedLessons.includes(l.id)).length})
              </button>
            </div>

            <div className="space-y-4">
              {filteredLessons.map((item) => {
                const isCompleted = progress.completedLessons.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-100' : 'bg-blue-100'
                        }`}
                      >
                        <Play className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.moduleTitle}</p>
                          </div>
                          <button
                            onClick={() => toggleBookmark(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                          </span>
                          {item.videoQuality === 'must-watch' && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">⭐ Must Watch</span>
                          )}
                          {isCompleted && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">✓ Completed</span>
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

