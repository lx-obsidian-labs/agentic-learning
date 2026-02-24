'use client';

import { useState } from 'react';
import Link from 'next/link';
import { courses, Lesson } from '@/data/courses';
import { useProgress } from '@/hooks/useProgress';
import { ChevronLeft, BookOpen, Clock, Search, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LessonWithCourse {
  lesson: Lesson;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
}

export default function NotesPage() {
  const { progress } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const allLessons: LessonWithCourse[] = [];
  courses.forEach(course => {
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        allLessons.push({
          lesson,
          courseId: course.id,
          courseTitle: course.title,
          moduleTitle: module.title,
        });
      });
    });
  });

  const filteredLessons = allLessons.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lesson.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lesson.keyPoints.some(kp => kp.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || 
      item.courseId.includes(selectedSubject);
    
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(courses.map(c => c.subject))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Notes</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{allLessons.length} lessons with notes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredLessons.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No notes found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredLessons.map((item) => (
                <div key={item.lesson.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        progress.completedLessons.includes(item.lesson.id) 
                          ? 'bg-green-100' 
                          : 'bg-blue-100'
                      }`}>
                        <BookOpen className={`w-5 h-5 ${
                          progress.completedLessons.includes(item.lesson.id)
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.lesson.title}</h3>
                          {progress.completedLessons.includes(item.lesson.id) && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {item.courseTitle} • {item.moduleTitle}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.lesson.keyPoints.slice(0, 4).map((kp, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {kp}
                            </span>
                          ))}
                        </div>
                        
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            View Notes
                          </summary>
                          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-950 rounded-xl">
                            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                              {item.lesson.notes}
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                    
                    <Link
                      href={`/course/${item.courseId}`}
                      className="ml-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                    >
                      Go to Lesson
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
