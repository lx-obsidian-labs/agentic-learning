'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useNotifications } from '@/components/NotificationContext';
import { Trophy, Gift, CheckCircle, Lock, Users, DollarSign } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  target: number;
  unlocked: boolean;
  reward?: string;
}

const BASE_STUDENT_COUNT = 1000;

function calculateAchievements(progress: ReturnType<typeof useProgress>['progress']): Achievement[] {
  const studentCount = BASE_STUDENT_COUNT + Math.floor(Date.now() / 86400000) * 10;

  return [
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      color: '#3B82F6',
      progress: progress.completedLessons.length,
      target: 1,
      unlocked: progress.completedLessons.length >= 1,
    },
    {
      id: 'five_lessons',
      name: 'Getting Started',
      description: 'Complete 5 lessons',
      icon: '📚',
      color: '#8B5CF6',
      progress: progress.completedLessons.length,
      target: 5,
      unlocked: progress.completedLessons.length >= 5,
    },
    {
      id: 'week_streak',
      name: 'Week Warrior',
      description: 'Maintain a 7-day study streak',
      icon: '🔥',
      color: '#F59E0B',
      progress: progress.streak,
      target: 7,
      unlocked: progress.streak >= 7,
    },
    {
      id: 'high_scorer',
      name: 'High Achiever',
      description: 'Maintain 90% average quiz score',
      icon: '⭐',
      color: '#14B8A6',
      progress: progress.analytics.averageQuizScore,
      target: 90,
      unlocked: progress.analytics.averageQuizScore >= 90,
      reward: 'R150',
    },
    {
      id: 'first_month',
      name: 'First Month Champion',
      description: 'Complete first month of learning',
      icon: '📅',
      color: '#0EA5E9',
      progress: Math.min(30, progress.streak),
      target: 30,
      unlocked: progress.streak >= 30,
      reward: `10% of first month revenue (R${Math.floor(studentCount * 0.1 * 0.1)})`,
    },
  ];
}

export default function AchievementsPage() {
  const { progress } = useProgress();
  const { addNotification } = useNotifications();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [studentCount, setStudentCount] = useState(BASE_STUDENT_COUNT);

  useEffect(() => {
    setStudentCount(BASE_STUDENT_COUNT + Math.floor(Date.now() / 86400000) * 10);
  }, []);

  useEffect(() => {
    const newAchievements = calculateAchievements(progress);
    setAchievements(newAchievements);

    const unlockedNow = newAchievements.filter(a => a.unlocked && !progress.badges.includes(a.id));
    if (unlockedNow.length > 0) {
      const latest = unlockedNow[unlockedNow.length - 1];
      addNotification({
        type: 'achievement',
        title: `Achievement Unlocked: ${latest.name}`,
        message: latest.description + (latest.reward ? ` Reward: ${latest.reward}` : ''),
        link: '/achievements',
      });
    }
  }, [progress, addNotification]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalValue = achievements
    .filter(a => a.unlocked && a.reward?.includes('R'))
    .reduce((acc, a) => {
      const match = a.reward?.match(/R(\d+)/);
      return acc + (match ? parseInt(match[1], 10) : 0);
    }, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                ← Back
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Achievements</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unlockedCount} of {achievements.length} unlocked
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Total Student Count</p>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span className="text-3xl font-bold">{studentCount.toLocaleString()}</span>
              </div>
              <p className="text-blue-100 text-sm mt-2">
                First month prize pool: R{Math.floor(studentCount * 0.1).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-8 h-8" />
              </div>
              <p className="text-xl font-bold mt-2">R{Math.floor(studentCount * 0.1 * 0.1)}</p>
              <p className="text-xs text-blue-100">Your 10%</p>
            </div>
          </div>
        </div>

        {totalValue > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-bold text-green-800 dark:text-green-200">You&apos;ve unlocked R{totalValue} in rewards!</p>
                <p className="text-sm text-green-600 dark:text-green-300">Keep learning to unlock more prizes</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const percentage = Math.min(100, (achievement.progress / achievement.target) * 100);
            return (
              <div
                key={achievement.id}
                className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/10'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      achievement.unlocked ? '' : 'grayscale opacity-50'
                    }`}
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    {achievement.icon}
                  </div>
                  {achievement.unlocked ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{achievement.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{achievement.description}</p>

                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">{achievement.progress} / {achievement.target}</p>

                {achievement.reward && (
                  <div className="mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300">🎁 {achievement.reward}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
