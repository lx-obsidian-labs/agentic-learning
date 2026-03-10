'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { 
  ChevronLeft, 
  TrendingUp, 
  Brain, 
  Target, 
  Award, 
  Clock, 
  Calendar,
  BarChart3,
  Flame,
  BookOpen,
  RefreshCw,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const { progress, getLearningInsights, getTopicsForReview } = useProgress();
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'progress'>('overview');
    const recommendedTopics = getRecommendedLessons() || [];
  
  const analytics = progress.analytics;
  const insights = getLearningInsights();
  const reviewTopics: string[] = getTopicsForReview() || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'advanced': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'advanced': return 'Advanced Learner';
      case 'intermediate': return 'Intermediate Learner';
      default: return 'Beginner Learner';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Learning Analytics</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Track your progress & performance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
              >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Your Learning Level</p>
                  <h2 className="text-3xl font-bold">{getDifficultyLabel(analytics.adaptiveDifficulty)}</h2>
                  <p className="text-blue-100 mt-2 text-sm">
                    Based on your average quiz score of {analytics.averageQuizScore}%
                  </p>
                </div>
                <Brain className="w-16 h-16 text-white/30" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.averageQuizScore}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{progress.streak}</p>
                    <p className="text-xs text-gray-500">Day Streak</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalStudyTime}</p>
                    <p className="text-xs text-gray-500">Minutes Studied</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{progress.badges.length}</p>
                    <p className="text-xs text-gray-500">Badges Earned</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Learning Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-lg">{insight.split(' ')[0]}</span>
                    <p className="text-gray-700">{insight.slice(insight.indexOf(' ') + 1)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Strongest Topic
                </h3>
                {analytics.strongestTopic ? (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-700 capitalize">{analytics.strongestTopic}</p>
                    <p className="text-sm text-green-600">
                      {analytics.topicScores[analytics.strongestTopic]?.correct || 0}/
                      {analytics.topicScores[analytics.strongestTopic]?.attempts || 0} mastered
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Complete quizzes to see your strengths</p>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Needs Improvement
                </h3>
                {analytics.weakestTopic ? (
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-2xl font-bold text-red-700 capitalize">{analytics.weakestTopic}</p>
                    <p className="text-sm text-red-600">
                      {analytics.topicScores[analytics.weakestTopic]?.correct || 0}/
                      {analytics.topicScores[analytics.weakestTopic]?.attempts || 0} correct
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Complete quizzes to identify areas to improve</p>
                )}
              </div>
            </div>

            {reviewTopics.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-500" />
                  Spaced Repetition Review
                </h3>
                <p className="text-gray-600 mb-4">
                  These topics are due for review based on your learning schedule:
                </p>
                <div className="flex flex-wrap gap-2">
                  {reviewTopics.map((topic, idx) => (
                    <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium capitalize">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Topic Performance
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.topicScores).map(([topic, data]) => {
                  const percentage = data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : 0;
                  const isMastered = percentage >= 80;
                  const needsWork = percentage < 60;
                  
                  return (
                    <div key={topic} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${
                            isMastered ? 'bg-green-500' : needsWork ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span className="font-medium capitalize text-gray-900">{topic}</span>
                        </div>
                        <span className={`font-bold ${isMastered ? 'text-green-600' : needsWork ? 'text-red-600' : 'text-yellow-600'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isMastered ? 'bg-green-500' : needsWork ? 'bg-red-500' : 'bg-yellow-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {data.correct}/{data.attempts} quizzes passed • Avg time: {Math.round(data.averageTime)}min
                      </p>
                    </div>
                  );
                })}
                
                {Object.keys(analytics.topicScores).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Complete quizzes to see your topic performance</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Weekly Progress
              </h3>
              <div className="space-y-3">
                {analytics.weeklyProgress.slice(-7).map((day, idx) => {
                  const maxMinutes = Math.max(...analytics.weeklyProgress.map(d => d.minutes), 1);
                  const height = day.minutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
                  
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-gray-500">{day.date.slice(5)}</span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-all"
                          style={{ width: `${height}%` }}
                        />
                        {day.minutes > 0 && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">
                            {day.minutes}min
                          </span>
                        )}
                      </div>
                      {day.score > 0 && (
                        <span className={`w-12 text-right text-sm ${day.score >= 80 ? 'text-green-600' : day.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {day.score}%
                        </span>
                      )}
                    </div>
                  );
                })}
                
                {analytics.weeklyProgress.length === 0 && (
                  <p className="text-center py-8 text-gray-500">Start studying to see your weekly progress</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-gray-500 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold">{analytics.totalSessions}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-gray-500 text-sm">Avg Session</p>
                <p className="text-2xl font-bold">{Math.round(analytics.averageSessionLength)}min</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-gray-500 text-sm">Active Recall</p>
                <p className="text-2xl font-bold">{analytics.activeRecallScore}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
