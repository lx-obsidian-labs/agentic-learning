'use client';

import Link from 'next/link';
import type { CourseCardDTO } from '@/lib/catalogTypes';
import { Clock, User, BarChart3 } from 'lucide-react';

interface CourseCardProps {
  course: CourseCardDTO;
}

const difficultyColors = {
  Beginner: '#22C55E',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444'
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/course/${course.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50">
        <div 
          className="h-32 p-6 flex items-end relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #1e293b 0%, #334155 100%)`
          }}
        >
          {course.thumbnailUrl && (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="relative z-10">
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full text-white mb-2 inline-block"
              style={{ backgroundColor: difficultyColors[course.difficulty] }}
            >
              {course.difficulty}
            </span>
            <h3 className="text-white text-lg font-bold">{course.title}</h3>
          </div>
        </div>
        
        <div className="p-5">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{course.instructorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.estimatedHours}h</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{course.moduleCount} Modules</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-600">{course.lessonCount} Lessons</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center py-2 bg-gray-50 rounded-xl group-hover:bg-gray-900 transition-colors">
            <span className="text-sm font-medium text-gray-900 group-hover:text-white">
              Start Learning →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
