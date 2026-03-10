'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useNotifications } from '@/components/NotificationContext';
  const getRewards = (achievement: Achievement) => {
    let rewardText = '';
    let rewardValue = 0;
    if (achievement.reward?.includes('R')) {
      const match = achievement.reward.match(/R(\d+)/);
      rewardValue = match ? parseInt(match[1]) : 0;
      rewardText = `R${rewardValue} Points`;
    } else if (achievement.reward?.includes('XP')) {
      const match = achievement.reward.match(/(\d+)XP/);
      rewardValue = match ? parseInt(match[1]) : 0;
      rewardText = `${rewardValue} XP`;
    }
    return { rewardText, rewardValue };
  };

  const calculateAchievements = (progress: UserProgress): Achievement[] => {
    const { badges, points, xp, streak, completedLessons, topicScores } = progress;
    
    const topicMastery = Object.entries(topicScores).filter(([, score]) => score.correct / score.attempts >= 0.8).length;

    const achievementsData: Achievement[] = [
      { id: 'first_lesson', name: 'First Step', description: 'Complete your first lesson', icon: '🎯', color: '#3B82F6', progress: completedLessons.length, target: 1, unlocked: badges.includes('first_lesson'), unlockedAt: progress.badges.find(id => id === 'first_lesson')?.timestamp, reward: 'R10' },
      { id: 'quick_learner', name: 'Quick Learner', description: 'Earn 100 points', icon: '⚡', color: '#F59E0B', progress: points, target: 100, unlocked: badges.includes('quick_learner'), unlockedAt: progress.badges.find(id => id === 'quick_learner')?.timestamp, reward: 'R20' },
      { id: 'week_streak', name: 'Week Warrior', description: 'Study for 7 days in a row', icon: '🔥', color: '#EF4444', progress: streak, target: 7, unlocked: badges.includes('week_streak'), unlockedAt: progress.badges.find(id => id === 'week_streak')?.timestamp, reward: 'R50' },
      { id: 'dedicated', name: 'Dedicated', description: 'Complete 10 lessons', icon: '🏆', color: '#8B5CF6', progress: completedLessons.length, target: 10, unlocked: badges.includes('dedicated'), unlockedAt: progress.badges.find(id => id === 'dedicated')?.timestamp, reward: 'R100' },
      { id: 'month_master', name: 'Month Master', description: 'Study for 30 days in a row', icon: '👑', color: '#FFD700', progress: streak, target: 30, unlocked: badges.includes('month_master'), unlockedAt: progress.badges.find(id => id === 'month_master')?.timestamp, reward: 'R200' },
      { id: 'high_achiever', name: 'High Achiever', description: 'Maintain 80% average score', icon: '⭐', color: '#10B981', progress: progress.analytics.averageQuizScore || 0, target: 80, unlocked: badges.includes('high_achiever'), unlockedAt: progress.badges.find(id => id === 'high_achiever')?.timestamp, reward: 'R150' },
      { id: 'topic_master', name: 'Topic Master', description: 'Master 5 topics (80% average score)', icon: '🎓', color: '#6366F1', progress: topicMastery, target: 5, unlocked: badges.includes('topic_master'), unlockedAt: progress.badges.find(id => id === 'topic_master')?.timestamp, reward: 'R250' },
      { id: 'level_up', name: 'Level Up', description: 'Reach Level 5', icon: '⬆️', color: '#F97316', progress: progress.level, target: 5, unlocked: badges.includes('level_up'), unlockedAt: progress.badges.find(id => id === 'level_up')?.timestamp, reward: 'R100' },
    ];
    
    // Add logic for perfect_score and early_bird/night_owl if tracking is implemented
    
    return achievementsData;
  };

  useEffect(() => {
    setStudentCount(BASE_STUDENT_COUNT + Math.floor(Date.now() / 86400000) * 10);
  }, []);

  useEffect(() => {
    const newAchievements = calculateAchievements(progress);
    setAchievements(newAchievements);

    const unlockedNow = newAchievements.filter(a => 
      a.unlocked && !progress.badges.includes(a.id)
    );

    if (unlockedNow.length > 0) {
      const latest = unlockedNow[unlockedNow.length - 1];
      addNotification({
        type: 'achievement',
        title: `Achievement Unlocked: ${latest.name}`,
        message: latest.description + (latest.reward ? ` Reward: ${latest.reward}` : ''),
        link: '/achievements'
      });
    }
  }, [progress, addNotification]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalValue = achievements
    .filter(a => a.unlocked && a.reward?.includes('R'))
    .reduce((acc, a) => {
      const match = a.reward!.match(/R(\d+)/);
      return acc + (match ? parseInt(match[1]) : 0);
    }, 0);

  const getIconComponent = (icon: string) => {
    const IconMap: Record<string, React.FC<any>> = {
      '🎯': Trophy, '⚡': Award, '🔥': Flame, '🏆': Gift, '👑': Target, '⭐': Star, '🎓': BookOpen, '⬆️': ArrowUp
    };
    return IconMap[icon] || Trophy;
  };
  
  const handleUnlockClick = (id: string) => {
    if (progress.badges.includes(id)) {
      setShowUnlocked(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Learning Achievements</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Track your progress, earn rewards, and stay motivated.</p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" /> Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Unlocked</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{unlockedCount}</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Total Reward Value</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">R{totalValue}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">Next Big Milestone</p>
              <p className="text-base font-bold text-green-600 dark:text-green-400 mt-2 truncate">{achievements.find(a => !a.unlocked)?.name || 'All achievements unlocked!'}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Platform Students: <span className="font-semibold text-gray-900 dark:text-gray-100">{studentCount.toLocaleString()}</span>
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
          Badges ({unlockedCount}/{achievements.length})
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((achievement) => {
            const Icon = getIconComponent(achievement.icon);
            const isUnlocked = achievement.unlocked;
            const isCurrent = showUnlocked === achievement.id;
            
            return (
              <div 
                key={achievement.id} 
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isCurrent 
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 shadow-lg' 
                    : isUnlocked 
                      ? 'border-green-300 bg-white dark:bg-gray-900/70 hover:border-green-500' 
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
                onClick={() => handleUnlockClick(achievement.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isUnlocked ? 'bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-6 h-6 ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`} />
                  </div>
                  {isUnlocked && (
                    <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">UNLOCKED</span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{achievement.name}</h3>
                <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                  {achievement.description}
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center text-xs font-medium">
                    <p className={`text-sm font-semibold ${isUnlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                      {isUnlocked ? 'Reward Claimed' : achievement.reward || 'No Reward'}
                    </p>
                  </div>
                  
                  {!isUnlocked && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {!isUnlocked && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Progress: {achievement.progress}/{achievement.target}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        {unlockedCount === achievements.length && (
          <div className="mt-10 p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-center text-white shadow-xl">
            <h3 className="text-3xl font-extrabold mb-2">All Clear!</h3>
            <p className="text-sm mb-4 opacity-90">You've earned all available badges. Keep learning!</p>
            <button 
              onClick={() => addNotification({ type: 'info', title: 'Great Work!', message: 'Keep pushing those knowledge boundaries!' })}
              className="px-6 py-3 bg-white text-yellow-800 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-md"
            >
              Celebrate!
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const BASE_STUDENT_COUNT = 1000;

function calculateAchievements(progress: ReturnType<typeof useProgress>['progress']): Achievement[] {
  const studentCount = BASE_STUDENT_COUNT + Math.floor(Date.now() / 86400000) * 10;
  
  const achievements: Achievement[] = [
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      color: '#3B82F6',
      progress: progress.completedLessons.length,
      target: 1,
      unlocked: progress.completedLessons.length >= 1,
      unlockedAt: progress.completedLessons.length >= 1 ? Date.now() : undefined,
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
      unlockedAt: progress.completedLessons.length >= 5 ? Date.now() : undefined,
    },
    {
      id: 'ten_lessons',
      name: 'Dedicated Learner',
      description: 'Complete 10 lessons',
      icon: '🏅',
      color: '#10B981',
      progress: progress.completedLessons.length,
      target: 10,
      unlocked: progress.completedLessons.length >= 10,
      unlockedAt: progress.completedLessons.length >= 10 ? Date.now() : undefined,
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
      unlockedAt: progress.streak >= 7 ? Date.now() : undefined,
    },
    {
      id: 'month_streak',
      name: 'Month Master',
      description: 'Maintain a 30-day study streak',
      icon: '👑',
      color: '#EF4444',
      progress: progress.streak,
      target: 30,
      unlocked: progress.streak >= 30,
      unlockedAt: progress.streak >= 30 ? Date.now() : undefined,
      reward: 'R500 bursary entry',
    },
    {
      id: 'perfect_quiz',
      name: 'Perfect Score',
      description: 'Score 100% on any quiz',
      icon: '💯',
      color: '#EC4899',
      progress: progress.quizScores.some(q => q.score === q.total) ? 1 : 0,
      target: 1,
      unlocked: progress.quizScores.some(q => q.score === q.total),
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
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Study before 7am',
      icon: '🌅',
      color: '#F97316',
      progress: 0,
      target: 1,
      unlocked: false,
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Study after 10pm',
      icon: '🦉',
      color: '#7C3AED',
      progress: 0,
      target: 1,
      unlocked: false,
    },
    {
      id: 'top_10_percent',
      name: 'Top 10% Learner',
      description: 'Rank in top 10% of all students',
      icon: '🏆',
      color: '#FFD700',
      progress: Math.min(100, Math.floor(100 - (progress.xp / (studentCount * 10)) * 100)),
      target: 10,
      unlocked: false,
      reward: 'Regional finalist',
    },
    {
      id: 'competition_qualify',
      name: 'Competition Qualifier',
      description: 'Qualify for regional finals',
      icon: '🎖️',
      color: '#6366F1',
      progress: 0,
      target: 10,
      unlocked: false,
      reward: 'R1,000 prize',
    },
    {
      id: 'first_month',
      name: 'First Month Champion',
      description: 'Complete first month of learning',
      icon: '📅',
      color: '#0EA5E9',
      progress: Math.min(30, progress.streak),
      target: 30,
      unlocked: false,
      reward: `10% of first month revenue (R${Math.floor(studentCount * 0.1 * 0.1)})`,
    },
    {
      id: 'help_others',
      name: 'Community Helper',
      description: 'Use AI tutor to help 10 other concepts',
      icon: '🤝',
      color: '#84CC16',
      progress: 0,
      target: 10,
      unlocked: false,
    },
    {
      id: 'complete_subject',
      name: 'Subject Master',
      description: 'Complete all lessons in a subject',
      icon: '🎓',
      color: '#06B6D4',
      progress: 0,
      target: 1,
      unlocked: false,
    },
  ];

  return achievements;
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

    const unlockedNow = newAchievements.filter(a => 
      a.unlocked && !progress.badges.includes(a.id)
    );

    if (unlockedNow.length > 0) {
      const latest = unlockedNow[unlockedNow.length - 1];
      addNotification({
        type: 'achievement',
        title: `Achievement Unlocked: ${latest.name}`,
        message: latest.description + (latest.reward ? ` Reward: ${latest.reward}` : ''),
        link: '/achievements'
      });
    }
  }, [progress, addNotification]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalValue = achievements
    .filter(a => a.unlocked && a.reward)
    .reduce((acc, a) => {
      if (a.reward?.includes('R')) {
        const match = a.reward.match(/R(\d+)/);
        return acc + (match ? parseInt(match[1]) : 0);
      }
      return acc;
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
                <p className="font-bold text-green-800 dark:text-green-200">
                  You&apos;ve unlocked R{totalValue} in rewards!
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Keep learning to unlock more prizes
                </p>
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
                    style={{ backgroundColor: achievement.color + '20' }}
                  >
                    {achievement.icon}
                  </div>
                  {achievement.unlocked ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                  {achievement.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
                  {achievement.description}
                </p>
                
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
                
                <p className="text-xs text-gray-500 mt-2">
                  {achievement.progress} / {achievement.target}
                </p>
                
                {achievement.reward && (
                  <div className="mt-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      🎁 {achievement.reward}
                    </p>
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
