'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { courses, subjects, Lesson } from '@/data/courses';
import { useProgress } from '@/hooks/useProgress';
import { Search, ChevronLeft, Play, Clock, BookOpen, Filter, X, Home, ChevronRight } from 'lucide-react';

interface SearchResult {
  type: 'lesson' | 'course' | 'subject';
  id: string;
  title: string;
  subtitle: string;
  courseId?: string;
}

export default function SearchPage() {
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchTerm = query.toLowerCase();
    const newResults: SearchResult[] = [];

    subjects.forEach(subject => {
      if (subject.name.toLowerCase().includes(searchTerm) || 
          subject.description.toLowerCase().includes(searchTerm)) {
        newResults.push({
          type: 'subject',
          id: subject.id,
          title: subject.name,
          subtitle: subject.description,
        });
      }
    });

    courses.forEach(course => {
      if (course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)) {
        newResults.push({
          type: 'course',
          id: course.id,
          title: course.title,
          subtitle: course.description,
        });
      }

      course.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          if (lesson.title.toLowerCase().includes(searchTerm) ||
              lesson.keyPoints.some(kp => kp.toLowerCase().includes(searchTerm))) {
            newResults.push({
              type: 'lesson',
              id: lesson.id,
              title: lesson.title,
              subtitle: `${course.title} - ${module.title}`,
              courseId: course.id,
            });
          }
        });
      });
    });

    setResults(newResults.slice(0, 20));
    setIsSearching(false);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'subject': return <BookOpen className="w-5 h-5" />;
      case 'course': return <Play className="w-5 h-5" />;
      case 'lesson': return <Clock className="w-5 h-5" />;
      default: return <Search className="w-5 h-5" />;
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
                    <p className="text-xs text-gray-500">{subject.courses} courses</p>
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
                      {getIcon(result.type)}
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
