'use client';

import { UserProgress, badgeInfo } from '@/hooks/useProgress';
import { Trophy, Flame, Clock, Target, Award, BookOpen, Zap, Star, RotateCcw } from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
  totalLessons: number;
  onReset: () => void;
}

export default function ProgressDashboard({ progress, totalLessons, onReset }: ProgressDashboardProps) {
  const completedCount = progress.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  const hours = Math.floor(progress.totalTimeSpent / 60);
  const minutes = progress.totalTimeSpent % 60;
  
  const earnedBadges = badgeInfo.filter(b => progress.badges.includes(b.id));
  const lockedBadges = badgeInfo.filter(b => !progress.badges.includes(b.id));

  const totalQuizPoints = progress.quizScores.reduce((acc, q) => acc + q.score, 0);
  const totalQuizQuestions = progress.quizScores.reduce((acc, q) => acc + q.total, 0);
  const quizAccuracy = totalQuizQuestions > 0 ? Math.round((totalQuizPoints / totalQuizQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
        <button 
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm opacity-90">Points</span>
          </div>
          <p className="text-3xl font-bold">{progress.points}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm opacity-90">Day Streak</span>
          </div>
          <p className="text-3xl font-bold">{progress.streak}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm opacity-90">Lessons</span>
          </div>
          <p className="text-3xl font-bold">{completedCount}/{totalLessons}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm opacity-90">Time</span>
          </div>
          <p className="text-3xl font-bold">{hours}h {minutes}m</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Course Progress</span>
          </div>
          <span className="text-sm text-gray-500">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="font-semibold text-gray-900">Quiz Performance</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">{totalQuizPoints}/{totalQuizQuestions}</p>
            <p className="text-sm text-gray-500">Questions Correct</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">{quizAccuracy}%</p>
            <p className="text-sm text-gray-500">Accuracy</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-gray-900">Badges</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {earnedBadges.map(badge => (
            <div 
              key={badge.id}
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: `${badge.color}15` }}
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
              <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
            </div>
          ))}
          
          {lockedBadges.map(badge => (
            <div 
              key={badge.id}
              className="p-4 rounded-xl text-center opacity-40"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <div className="text-3xl mb-1 grayscale">🔒</div>
              <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
              <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
