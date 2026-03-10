'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Play, Clock, BookOpen, X, Home, ChevronRight, Brain, Lightbulb, Target, Zap, ArrowRight } from 'lucide-react';
import type { SubjectDTO } from '@/lib/catalogTypes';

interface SearchResult {
  type: 'lesson' | 'course' | 'subject';
  id: string;
  title: string;
  subtitle: string;
  courseId?: string;
}

interface AIRecommendation {
  type: 'topic' | 'lesson' | 'concept' | 'practice';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  relatedConcepts?: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);
  const [subjects, setSubjects] = useState<SubjectDTO[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadSubjects = async () => {
      try {
        const res = await fetch('/api/catalog/subjects', { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as unknown;
        if (Array.isArray(data)) setSubjects(data as SubjectDTO[]);
      } catch {
        // ignore
      }
    };

    void loadSubjects();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setRecommendations([]);
      setIsSearching(false);
      setIsGettingRecommendations(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/catalog/search?query=${encodeURIComponent(q)}&limit=20`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Search failed');
        const data = (await res.json()) as unknown;
        if (Array.isArray(data)) setResults(data as SearchResult[]);
        else setResults([]);
      } catch {
        if (controller.signal.aborted) return;
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 200);

    const fetchRecommendations = async () => {
      try {
        setIsGettingRecommendations(true);
        const res = await fetch('/api/catalog/search/ai-enhanced', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ 
            query: q,
            context: {
              grade: 12,
            }
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.recommendations && Array.isArray(data.recommendations)) {
            setRecommendations(data.recommendations);
          }
        }
      } catch {
        // If AI recommendations fail, continue silently
      } finally {
        setIsGettingRecommendations(false);
      }
    };

    void fetchRecommendations();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subject': return <BookOpen className="w-5 h-5" />;
      case 'course': return <Play className="w-5 h-5" />;
      case 'lesson': return <Clock className="w-5 h-5" />;
      default: return <Search className="w-5 h-5" />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'topic': return <Target className="w-4 h-4" />;
      case 'lesson': return <Play className="w-4 h-4" />;
      case 'concept': return <Lightbulb className="w-4 h-4" />;
      case 'practice': return <Zap className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'subject': return 'bg-blue-100 text-blue-600';
      case 'course': return 'bg-purple-100 text-purple-600';
      case 'lesson': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getHref = (result: SearchResult) => {
    switch (result.type) {
      case 'subject': return `/subject/${result.id}`;
      case 'course': return `/course/${result.id}`;
      case 'lesson': return result.courseId ? `/course/${result.courseId}` : '/';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons, courses, subjects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Search</span>
        </nav>

        {query.length < 2 ? (
          <div>
            <div className="text-center py-8">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Search for anything</h2>
              <p className="text-gray-500">
                Search lessons, courses, or subjects by name or topic
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Popular searches</h3>
              <div className="flex flex-wrap gap-2">
                {['calculus', 'derivatives', 'photosynthesis', 'Newton', 'DNA', 'economics', 'geometry'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Browse by subject</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjects.slice(0, 8).map((subject) => (
                  <Link
                    key={subject.id}
                    href={`/subject/${subject.id}`}
                    className="p-4 bg-white border border-gray-200 rounded-xl text-center hover:border-gray-300 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{subject.name}</p>
                    <p className="text-xs text-gray-500">{subject.courseCount} courses</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : isSearching ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-500 mt-4">Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500">
              Try searching for something else
            </p>
          </div>
         ) : (
          <>
            {query.length >= 2 && (
              <>
                {isGettingRecommendations ? (
                  <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI-Powered Recommendations</h3>
                    </div>
                    <div className="animate-pulse space-y-2">
                      {[1,2,3].map(n => (
                        <div key={n} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                      ))}
                    </div>
                  </div>
                ) : recommendations.length > 0 && (
                  <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Study Recommendations</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Based on your search: &quot;{query}&quot;</p>
                    </div>
                    <div className="p-4 space-y-3">
                      {recommendations.slice(0, 5).map((rec, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2">
                              <div className={`p-1 rounded ${getPriorityColor(rec.priority)}`}>
                                {getRecommendationIcon(rec.type)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {rec.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {rec.description}
                                </p>
                              </div>
                            </div>
                            {rec.estimatedTime && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                ⏱ {rec.estimatedTime}
                              </span>
                            )}
                          </div>
                          {rec.relatedConcepts && rec.relatedConcepts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {rec.relatedConcepts.slice(0, 3).map((concept, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                  {concept}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <p className="text-sm text-gray-500 mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            
            <div className="space-y-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}-${index}`}
                  href={getHref(result)}
                  className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{result.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                          result.type === 'subject' ? 'bg-blue-100 text-blue-700' :
                          result.type === 'course' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{result.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
