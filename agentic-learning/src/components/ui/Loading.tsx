import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

const dotSizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
};

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  className,
  text 
}: LoadingProps) {
  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className="flex gap-2">
          <span className={cn('bg-blue-600 rounded-full animate-bounce', dotSizes[size])} style={{ animationDelay: '0ms' }} />
          <span className={cn('bg-blue-600 rounded-full animate-bounce', dotSizes[size])} style={{ animationDelay: '150ms' }} />
          <span className={cn('bg-blue-600 rounded-full animate-bounce', dotSizes[size])} style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className={cn('text-gray-600 dark:text-gray-400', textSizes[size])}>{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
        <div className={cn('bg-blue-600 rounded-full animate-pulse', spinnerSizes[size])} />
        {text && <p className={cn('text-gray-600 dark:text-gray-400', textSizes[size])}>{text}</p>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <svg 
        className={cn('animate-spin text-blue-600', spinnerSizes[size])} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <p className={cn('text-gray-600 dark:text-gray-400', textSizes[size])}>{text}</p>}
    </div>
  );
}

interface PageLoadingProps {
  text?: string;
}

export function PageLoading({ text = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

export default Loading;
