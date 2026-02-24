'use client';

import { useEffect, useState } from 'react';

interface BrainLogoProps {
  progress?: number;
  size?: number;
  className?: string;
}

export default function BrainLogo({ progress = 0, size = 40, className = '' }: BrainLogoProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = progress / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= progress) {
        setAnimatedProgress(progress);
        clearInterval(timer);
      } else {
        setAnimatedProgress(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 0.1) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size * 0.4;
  const waveHeight = Math.sin(pulsePhase) * 3;

  const circumference = 2 * Math.PI * maxRadius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform transition-transform duration-500"
        style={{
          transform: isLoaded ? 'scale(1)' : 'scale(0.8)',
          opacity: isLoaded ? 1 : 0
        }}
      >
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${centerX} ${centerY})`}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'url(#glow)'
          }}
        />

        <g 
          className="transition-transform duration-300"
          style={{
            transform: `translateY(${waveHeight}px)`
          }}
        >
          <path
            d={`
              M ${size * 0.35} ${size * 0.5}
              Q ${size * 0.3} ${size * 0.35}, ${size * 0.4} ${size * 0.3}
              Q ${size * 0.45} ${size * 0.25}, ${size * 0.5} ${size * 0.28}
              Q ${size * 0.55} ${size * 0.25}, ${size * 0.6} ${size * 0.35}
              Q ${size * 0.65} ${size * 0.3}, ${size * 0.65} ${size * 0.5}
              Q ${size * 0.65} ${size * 0.7}, ${size * 0.6} ${size * 0.75}
              Q ${size * 0.55} ${size * 0.8}, ${size * 0.5} ${size * 0.78}
              Q ${size * 0.45} ${size * 0.8}, ${size * 0.4} ${size * 0.75}
              Q ${size * 0.35} ${size * 0.7}, ${size * 0.35} ${size * 0.5}
            `}
            fill="url(#brainGradient)"
            opacity="0.9"
          />

          <path
            d={`
              M ${size * 0.42} ${size * 0.45}
              Q ${size * 0.38} ${size * 0.4}, ${size * 0.45} ${size * 0.35}
            `}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          <path
            d={`
              M ${size * 0.58} ${size * 0.45}
              Q ${size * 0.62} ${size * 0.4}, ${size * 0.55} ${size * 0.35}
            `}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          <circle
            cx={size * 0.43}
            cy={size * 0.47}
            r={size * 0.04}
            fill="white"
            opacity="0.9"
          />
          <circle
            cx={size * 0.57}
            cy={size * 0.47}
            r={size * 0.04}
            fill="white"
            opacity="0.9"
          />

          <path
            d={`
              M ${size * 0.46} ${size * 0.58}
              Q ${size * 0.5} ${size * 0.63}, ${size * 0.54} ${size * 0.58}
            `}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius + 6}
          fill="none"
          stroke="url(#brainGradient)"
          strokeWidth="1"
          opacity="0.3"
          className="animate-ping"
          style={{ animationDuration: '2s' }}
        />
      </svg>

      {animatedProgress > 0 && (
        <div 
          className="absolute -bottom-1 -right-1 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ width: size * 0.35, height: size * 0.35 }}
        >
          {Math.round(animatedProgress)}%
        </div>
      )}
    </div>
  );
}
