'use client';

import { useState, useRef, useEffect } from 'react';
import { subjects, courses } from '@/data/courses';
import { useProgress, badgeInfo } from '@/hooks/useProgress';
import SubjectCard from '@/components/SubjectCard';
import CourseCard from '@/components/CourseCard';
import BrainLogo from '@/components/BrainLogo';
import { Brain, Zap, Target, ChevronRight, Flame, Trophy, Clock, Search, Bookmark, Settings, BookOpen, BarChart3, FileText, Users, Menu, X as CloseIcon, Bot, Award, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { progress, isLoaded } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [progressDropdownOpen, setProgressDropdownOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const learnRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) setLearnDropdownOpen(false);
      if (progressRef.current && !progressRef.current.contains(event.target as Node)) setProgressDropdownOpen(false);
      if (communityRef.current && !communityRef.current.contains(event.target as Node)) setCommunityDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuredCourses = courses.slice(0, 3);
  
  const totalLessons = courses.reduce((acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0);
  const earnedBadges = badgeInfo.filter(b => progress.badges.includes(b.id));
  const progressPercent = totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BrainLogo progress={progressPercent} size={40} />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Agentic Learning</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">by LX Obsidian Labs</p>
              </div>
            </div>
            
            {isLoaded && progress.points > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">{progress.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700">{progress.points} pts</span>
                </div>
                {earnedBadges.length > 0 && (
                  <div className="flex items-center gap-1">
                    {earnedBadges.slice(0, 3).map(b => (
                      <span key={b.id} className="text-lg" title={b.name}>{b.icon}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/tutor" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-1">
                <Bot className="w-4 h-4" />
                AI Tutor
              </Link>
              
              <div ref={communityRef} className="relative">
                <button 
                  onClick={() => setCommunityDropdownOpen(!communityDropdownOpen)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-1"
                >
                  Community <ChevronDown className={`w-4 h-4 transition-transform ${communityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {communityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <Link href="/leaderboard" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Trophy className="w-4 h-4" /> Leaderboard
                    </Link>
                    <Link href="/competition" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Award className="w-4 h-4" /> Competition
                    </Link>
                  </div>
                )}
              </div>

              <div ref={progressRef} className="relative">
                <button 
                  onClick={() => setProgressDropdownOpen(!progressDropdownOpen)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-1"
                >
                  Progress <ChevronDown className={`w-4 h-4 transition-transform ${progressDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {progressDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <Link href="/report" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <FileText className="w-4 h-4" /> Report Card
                    </Link>
                    <Link href="/analytics" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <BarChart3 className="w-4 h-4" /> Analytics
                    </Link>
                  </div>
                )}
              </div>

              <div ref={learnRef} className="relative">
                <button 
                  onClick={() => setLearnDropdownOpen(!learnDropdownOpen)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-1"
                >
                  Learn <ChevronDown className={`w-4 h-4 transition-transform ${learnDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {learnDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <Link href="/search" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Search className="w-4 h-4" /> Search
                    </Link>
                    <Link href="/notes" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <BookOpen className="w-4 h-4" /> Notes
                    </Link>
                    <Link href="/bookmarks" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Bookmark className="w-4 h-4" /> Bookmarks
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-1">
                <Settings className="w-4 h-4" />
              </Link>
              <Link href="/onboarding" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </Link>
            </nav>
            
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-4">
            <div className="flex flex-col gap-4">
              <Link href="/tutor" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <Bot className="w-4 h-4" /> AI Tutor
              </Link>
              <Link href="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <Trophy className="w-4 h-4" /> Leaderboard
              </Link>
              <Link href="/competition" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <Award className="w-4 h-4" /> Competition
              </Link>
              <Link href="/report" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <FileText className="w-4 h-4" /> Report Card
              </Link>
              <Link href="/analytics" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <BarChart3 className="w-4 h-4" /> Analytics
              </Link>
              <Link href="/search" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <Search className="w-4 h-4" /> Search
              </Link>
              <Link href="/notes" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <BookOpen className="w-4 h-4" /> Notes
              </Link>
              <Link href="/bookmarks" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <Bookmark className="w-4 h-4" /> Bookmarks
              </Link>
              <Link href="/settings" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2 py-2">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>
          </div>
        )}
      </header>

      {isLoaded && progress.points > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-white">
                  <p className="text-sm opacity-80">Continue Learning</p>
                  <p className="text-2xl font-bold">{progress.completedLessons.length} lessons completed</p>
                </div>
                <div className="h-12 w-px bg-white/30" />
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-white">
                      <Flame className="w-5 h-5 text-orange-300" />
                      <span className="text-xl font-bold">{progress.streak}</span>
                    </div>
                    <p className="text-xs text-white/70">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-white">
                      <Zap className="w-5 h-5 text-yellow-300" />
                      <span className="text-xl font-bold">{progress.points}</span>
                    </div>
                    <p className="text-xs text-white/70">Points</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-white">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span className="text-xl font-bold">{earnedBadges.length}</span>
                    </div>
                    <p className="text-xs text-white/70">Badges</p>
                  </div>
                </div>
              </div>
              <a href={`/course/${courses[0]?.id}`} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Resume →
              </a>
            </div>
          </div>
        </section>
      )}
      
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Learn Smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Not Harder
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Strategic video selection and focused notes powered by AI. 
              Master your matric subjects with precision.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/onboarding" className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                Start Learning
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a href="#subjects" className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                View Courses
              </a>
            </div>
            
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white">11</p>
                <p className="text-gray-400 text-sm">Subjects</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-gray-400 text-sm">Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-gray-400 text-sm">Videos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">AI</p>
                <p className="text-gray-400 text-sm">Powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Strategic Video Selection</h3>
              <p className="text-gray-600">AI curates the most important videos, saving you hours of searching.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Focused Notes</h3>
              <p className="text-gray-600">Key points extracted from every lesson for efficient revision.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Study Tutor</h3>
              <p className="text-gray-600">Get instant help with any topic from our AI-powered tutor.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="subjects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Subject</h2>
              <p className="text-gray-600">Select a subject to start your learning journey</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
              <p className="text-gray-600">AI-curated courses for matric success</p>
            </div>
            <a href="#courses" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Target className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">AI Study Plans</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Personalized Learning with AI
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our AI analyzes your progress and recommends the exact videos and notes 
            you need to improve. Focus on what matters most.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Recommendations</h3>
              <p className="text-blue-100 text-sm">AI suggests the best videos based on your learning style and progress.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Focused Study Plans</h3>
              <p className="text-blue-100 text-sm">Personalized schedules targeting your weak areas.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Progress Analytics</h3>
              <p className="text-blue-100 text-sm">Track understanding per topic and see real improvement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What Students Say</h2>
            <p className="text-gray-600">Join thousands of students improving their grades</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The AI tutor helped me understand calculus concepts I was struggling with for weeks. My marks improved significantly!"</p>
              <p className="font-medium text-gray-900">- Sarah M., Grade 12</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Instead of watching hours of videos, I focus only on the must-watch ones. Saved me so much time during exams!"</p>
              <p className="font-medium text-gray-900">- Thabo K., Grade 12</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The spaced repetition system keeps me on track. I actually remember what I learned instead of forgetting it!"</p>
              <p className="font-medium text-gray-900">- Amy L., Grade 12</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bot className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Need Help? Ask AI Tutor</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Stuck on a problem? Get instant explanations from our AI-powered study tutor. Available 24/7.
          </p>
          <Link href="/tutor" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Chat with AI Tutor
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Agentic Learning</span>
            </div>
            
            <p className="text-gray-400 text-sm">
              Powered by LX Obsidian Labs. Learning, Reimagined.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
