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
  Calendar,
  Gift,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  Lock
} from 'lucide-react';
import { competitions, mockCompetitionLeaderboard, getActiveCompetition, CompetitionEntry } from '@/data/competitions';

export default function CompetitionPage() {
  const { progress } = useProgress();
  const [selectedYear, setSelectedYear] = useState<string>('matric-2026');
  const competition = competitions.find(c => c.id === selectedYear) || getActiveCompetition();
  
  const userEntry: CompetitionEntry = {
    id: 'you',
    studentId: 'you',
    studentName: 'You',
    avatar: '🎓',
    xp: progress.xp || 0,
    level: progress.level || 1,
    streak: progress.streak || 0,
    completedLessons: progress.completedLessons.length,
    badges: progress.badges.length,
    rank: 1
  };

  const leaderboard = [userEntry, ...mockCompetitionLeaderboard.slice(1)];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-7 h-7 text-gray-400" />;
      case 3: return <Medal className="w-7 h-7 text-amber-600" />;
      default: return <span className="text-xl font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
    return 'bg-white/10 text-white/70';
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
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Yearly Competitions</h1>
                <p className="text-xs text-white/60">Win prizes for top performance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {competitions.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedYear(comp.id)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedYear === comp.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {comp.year} Championship
              {comp.status === 'active' && <span className="ml-2 text-xs">●</span>}
            </button>
          ))}
        </div>

        {competition && (
          <>
            <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  {competition.status === 'active' ? (
                    <span className="px-3 py-1 bg-green-500 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  ) : competition.status === 'ended' ? (
                    <span className="px-3 py-1 bg-gray-500 rounded-full text-sm font-medium flex items-center gap-1">
                      <Lock className="w-4 h-4" /> Ended
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-medium">Upcoming</span>
                  )}
                </div>
                
                <h2 className="text-4xl font-bold mb-4">{competition.name}</h2>
                <p className="text-yellow-100 text-lg mb-6 max-w-2xl">{competition.description}</p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Started: {new Date(competition.startDate).toLocaleDateString('en-ZA')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Ends: {new Date(competition.endDate).toLocaleDateString('en-ZA')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    <span>R{competition.prizes.reduce((a, p) => a + p.value, 0).toLocaleString()} in prizes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  Top 10 Prizes
                </h3>
                <div className="space-y-3">
                  {competition.prizes.slice(0, 10).map((prize) => (
                    <div 
                      key={prize.rank}
                      className={`p-3 rounded-xl border ${
                        prize.rank <= 3 
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(prize.rank)}`}>
                            {prize.rank === 1 ? '🥇' : prize.rank === 2 ? '🥈' : prize.rank === 3 ? '🥉' : prize.rank}
                          </div>
                          <div>
                            <p className="font-bold text-white">{prize.title}</p>
                            <p className="text-white/60 text-sm">{prize.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-400 font-bold">R{prize.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  How to Win
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Complete Lessons</p>
                      <p className="text-white/60 text-sm">Finish video lessons to earn XP</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Pass Quizzes</p>
                      <p className="text-white/60 text-sm">Score 80%+ to unlock next lessons</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Build Streaks</p>
                      <p className="text-white/60 text-sm">Study daily to multiply your XP</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Earn Badges</p>
                      <p className="text-white/60 text-sm">Unlock achievements for bonus XP</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <p className="text-blue-200 text-sm">
                    <strong>Tip:</strong> Top performers from 2025 scored over 4000 XP by completing 100+ lessons!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Competition Leaderboard
                </h3>
              </div>
              
              <div className="divide-y divide-white/10">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.id}
                    className={`p-4 flex items-center gap-4 ${
                      entry.studentName === 'You' ? 'bg-blue-500/20' : ''
                    }`}
                  >
                    <div className="w-12 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
                      {entry.avatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-lg">{entry.studentName}</p>
                        {entry.studentName === 'You' && (
                          <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-white/60">Level {entry.level} • {entry.xp.toLocaleString()} XP</p>
                    </div>
                    
                    <div className="text-center px-4">
                      <div className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-4 h-4" />
                        <span className="font-bold">{entry.streak}</span>
                      </div>
                      <p className="text-white/60 text-xs">streak</p>
                    </div>
                    
                    <div className="text-center px-4">
                      <div className="flex items-center gap-1 text-blue-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-bold">{entry.completedLessons}</span>
                      </div>
                      <p className="text-white/60 text-xs">lessons</p>
                    </div>
                    
                    <div className="text-center px-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">{entry.badges}</span>
                      </div>
                      <p className="text-white/60 text-xs">badges</p>
                    </div>
                    
                    {entry.rank <= 10 && (
                      <div className={`px-4 py-2 rounded-xl text-center ${getRankBadge(entry.rank)}`}>
                        <p className="font-bold">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : ''}</p>
                        <p className="text-xs">{competition.prizes[entry.rank - 1]?.title.split(' ')[0]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Compete?</h3>
              <p className="mb-4">Start learning now to climb the leaderboard and win amazing prizes!</p>
              <Link 
                href="/course/mathematics-p1" 
                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
              >
                Start Learning
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
