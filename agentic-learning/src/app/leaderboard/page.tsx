'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { 
  ChevronLeft, 
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  Zap,
  Target,
  TrendingUp,
  Award,
  Users,
  Calendar,
  BookOpen
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  badges: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { progress, getLevelProgress, getDailyChallenges } = useProgress();
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  
  const levelProgress = getLevelProgress();
  const dailyChallenges = getDailyChallenges();
  
  const mockLeaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'You', avatar: '🎓', level: progress.level || 1, xp: progress.xp || 0, streak: progress.streak || 0, badges: progress.badges.length, rank: 1 },
    { id: '2', name: 'Sarah M.', avatar: '👩‍🎓', level: 12, xp: 4500, streak: 45, badges: 28, rank: 2 },
    { id: '3', name: 'James K.', avatar: '👨‍💻', level: 11, xp: 3800, streak: 32, badges: 24, rank: 3 },
    { id: '4', name: 'Emily R.', avatar: '👩‍🔬', level: 10, xp: 3200, streak: 28, badges: 21, rank: 4 },
    { id: '5', name: 'Michael T.', avatar: '👨‍🎨', level: 9, xp: 2800, streak: 21, badges: 18, rank: 5 },
    { id: '6', name: 'Anna L.', avatar: '👩‍🏫', level: 8, xp: 2400, streak: 18, badges: 15, rank: 6 },
    { id: '7', name: 'David W.', avatar: '👨‍🔧', level: 7, xp: 2000, streak: 14, badges: 12, rank: 7 },
    { id: '8', name: 'Lisa P.', avatar: '👩‍⚕️', level: 6, xp: 1650, streak: 10, badges: 10, rank: 8 },
    { id: '9', name: 'Tom H.', avatar: '👨‍🌾', level: 5, xp: 1300, streak: 7, badges: 8, rank: 9 },
    { id: '10', name: 'Emma J.', avatar: '👩‍🎤', level: 4, xp: 950, streak: 5, badges: 6, rank: 10 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getChallengeIcon = (id: string) => {
    switch (id) {
      case 'daily_lesson': return <BookOpen className="w-5 h-5" />;
      case 'daily_quiz': return <Target className="w-5 h-5" />;
      case 'daily_study': return <Flame className="w-5 h-5" />;
      case 'daily_repeat': return <Zap className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getChallengeName = (id: string) => {
    switch (id) {
      case 'daily_lesson': return 'Complete Lesson';
      case 'daily_quiz': return 'Pass Quiz';
      case 'daily_study': return 'Study 15 mins';
      case 'daily_repeat': return 'Review 3 topics';
      default: return 'Challenge';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Leaderboard</h1>
                <p className="text-xs text-white/60">Compete with other learners</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Your Current Level</p>
              <h2 className="text-4xl font-bold mb-2">Level {progress.level || 1}</h2>
              <p className="text-blue-100">
                {levelProgress.current} / {levelProgress.required} XP to next level
              </p>
              <div className="w-48 h-3 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${levelProgress.percentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-12 h-12" />
              </div>
              <p className="text-2xl font-bold">{progress.xp || 0} XP</p>
              <p className="text-blue-100 text-sm">Total Earned</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{progress.streak || 0}</p>
                <p className="text-white/60 text-sm">Day Streak</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{progress.badges.length}</p>
                <p className="text-white/60 text-sm">Badges Earned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">#{1}</p>
                <p className="text-white/60 text-sm">Your Rank</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Challenges
            </h3>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-3">
            {dailyChallenges.map((challenge) => (
              <div 
                key={challenge.id}
                className={`p-3 rounded-xl border ${
                  challenge.completed 
                    ? 'bg-green-500/20 border-green-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      challenge.completed ? 'bg-green-500' : 'bg-white/10'
                    }`}>
                      {getChallengeIcon(challenge.id)}
                    </div>
                    <span className="text-white font-medium">{getChallengeName(challenge.id)}</span>
                  </div>
                  {challenge.completed && (
                    <span className="text-green-400 text-sm">✓ Done</span>
                  )}
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${challenge.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` }}
                  />
                </div>
                <p className="text-white/60 text-xs mt-1">
                  {challenge.progress} / {challenge.target}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Learners
            </h3>
            <div className="flex gap-2">
              {(['weekly', 'monthly', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeFilter === filter 
                      ? 'bg-white text-purple-900' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="divide-y divide-white/10">
            {mockLeaderboard.map((entry) => (
              <div 
                key={entry.id}
                className={`p-4 flex items-center gap-4 ${
                  entry.name === 'You' ? 'bg-blue-500/20' : ''
                }`}
              >
                <div className="w-10 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                  {entry.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{entry.name}</p>
                    {entry.name === 'You' && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">You</span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">Level {entry.level} • {entry.xp.toLocaleString()} XP</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{entry.streak}</span>
                  </div>
                  <p className="text-white/60 text-xs">day streak</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{entry.badges}</span>
                  </div>
                  <p className="text-white/60 text-xs">badges</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
