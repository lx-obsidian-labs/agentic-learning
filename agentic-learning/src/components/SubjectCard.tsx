'use client';

import Link from 'next/link';
import type { SubjectDTO } from '@/lib/catalogTypes';

interface SubjectCardProps {
  subject: SubjectDTO;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator: function Calculator({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8" y2="10.01" />
        <line x1="12" y1="10" x2="12" y2="10.01" />
        <line x1="16" y1="10" x2="16" y2="10.01" />
        <line x1="8" y1="14" x2="8" y2="14.01" />
        <line x1="12" y1="14" x2="12" y2="14.01" />
        <line x1="16" y1="14" x2="16" y2="14.01" />
        <line x1="8" y1="18" x2="8" y2="18.01" />
        <line x1="12" y1="18" x2="16" y2="18" />
      </svg>
    );
  },
  Atom: function Atom({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    );
  },
  Dna: function Dna({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 15c6.667-6 13.333 0 20-6" />
        <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
        <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
        <path d="M17 6l-2.5-2.5" />
        <path d="M14 8l-1.5-1.5" />
        <path d="M7 18l2.5 2.5" />
        <path d="M10 16l1.5 1.5" />
      </svg>
    );
  },
  Globe: function Globe({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  },
  Receipt: function Receipt({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    );
  },
  TrendingUp: function TrendingUp({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    );
  },
  BookOpen: function BookOpen({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  },
  Languages: function Languages({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 8l6 6" />
        <path d="M4 14l6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="M22 22l-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    );
  },
  Briefcase: function Briefcase({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </svg>
    );
  },
  Landmark: function Landmark({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l9 5H3l9-5z" />
        <path d="M4 10v10" />
        <path d="M8 10v10" />
        <path d="M12 10v10" />
        <path d="M16 10v10" />
        <path d="M20 10v10" />
        <path d="M3 21h18" />
      </svg>
    );
  },
  Laptop: function Laptop({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M2 20h20" />
        <path d="M6 20l1-4h10l1 4" />
      </svg>
    );
  }
};

export default function SubjectCard({ subject }: SubjectCardProps) {
  const IconComponent = iconMap[subject.iconKey] || iconMap.Calculator;
  
  return (
    <Link href={`/subject/${subject.id}`}>
      <div 
        className="group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
        style={{ 
          backgroundColor: `${subject.color}15`,
          border: `1px solid ${subject.color}30`
        }}
      >
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
          style={{ backgroundColor: subject.color }}
        >
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">{subject.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{subject.description}</p>
        
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: subject.color, color: 'white' }}
          >
            {subject.courseCount} Courses
          </span>
        </div>
        
        <div 
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
          style={{ backgroundColor: subject.color, transform: 'translate(30%, -30%)' }}
        />
      </div>
    </Link>
  );
}
