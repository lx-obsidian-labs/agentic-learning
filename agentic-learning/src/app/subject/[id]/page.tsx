'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { ChevronLeft, Brain, ChevronRight, Home } from 'lucide-react';
import type { CourseCardDTO, SubjectDTO } from '@/lib/catalogTypes';

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.id as string;
  
  const [subject, setSubject] = useState<SubjectDTO | null>(null);
  const [subjectCourses, setSubjectCourses] = useState<CourseCardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    const controller = new AbortController();
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [subjectsRes, coursesRes] = await Promise.all([
          fetch('/api/catalog/subjects', { signal: controller.signal }),
          fetch(`/api/catalog/courses?subjectId=${encodeURIComponent(subjectId)}`, { signal: controller.signal }),
        ]);

        if (!subjectsRes.ok) throw new Error('Failed to load subjects');
        if (!coursesRes.ok) throw new Error('Failed to load courses');

        const [subjectsData, coursesData] = (await Promise.all([
          subjectsRes.json(),
          coursesRes.json(),
        ])) as [SubjectDTO[], CourseCardDTO[]];

        setSubject(subjectsData.find((s) => s.id === subjectId) ?? null);
        setSubjectCourses(coursesData);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load subject');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [subjectId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading subject...</p>
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

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Subject not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: subject.color }}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Agentic Learning</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">by LX Obsidian Labs</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div 
        className="relative py-16"
        style={{
          background: `linear-gradient(135deg, ${subject.color}20 0%, ${subject.color}10 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{subject.name}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{subject.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{subject.description}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Available Courses ({subjectCourses.length})
        </h2>
        
        {subjectCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">Courses coming soon for {subject.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
