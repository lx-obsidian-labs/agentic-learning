'use client';

import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useUser, UserButton } from '@clerk/nextjs';
import { useNotifications } from '@/components/NotificationContext';
import { 
  Moon, Sun, Monitor, Bell, BellOff, Play, RotateCcw, ChevronLeft,
  User, Download, Shield, HelpCircle, Info, MapPin, Globe, 
  GraduationCap, Settings, Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const REGIONS = [
  { id: 'gauteng', name: 'Gauteng' },
  { id: 'western-cape', name: 'Western Cape' },
  { id: 'kzn', name: 'KwaZulu-Natal' },
  { id: 'eastern-cape', name: 'Eastern Cape' },
  { id: 'limpopo', name: 'Limpopo' },
  { id: 'mpumalanga', name: 'Mpumalanga' },
  { id: 'north-west', name: 'North West' },
  { id: 'free-state', name: 'Free State' },
  { id: 'northern-cape', name: 'Northern Cape' },
];

const GRADES = [10, 11, 12];

export default function SettingsPage() {
  const { isSignedIn, user } = useUser();
  const { progress, updateSettings, updateRegionAndGrade, resetProgress } = useProgress();
  const { addNotification } = useNotifications();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(progress.region || 'gauteng');
  const [selectedGrade, setSelectedGrade] = useState(progress.grade || 12);
  const { theme, setTheme, systemTheme } = useTheme();
  const activeTheme = theme ?? 'system';
  const resolvedTheme = activeTheme === 'system' ? systemTheme : activeTheme;

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    updateRegionAndGrade(region, selectedGrade);
    addNotification({
      type: 'system',
      title: 'Region Updated',
      message: `Your region has been set to ${region}.`,
    });
  };

  const handleGradeChange = (grade: number) => {
    setSelectedGrade(grade);
    updateRegionAndGrade(selectedRegion, grade);
    addNotification({
      type: 'system',
      title: 'Grade Updated',
      message: `Your grade has been set to Grade ${grade}.`,
    });
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    addNotification({
      type: 'system',
      title: 'Progress Reset',
      message: 'All your learning progress has been reset.',
    });
  };

  const handleExportData = () => {
    const data = { progress, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentic-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification({
      type: 'system',
      title: 'Data Exported',
      message: 'Your learning data has been downloaded.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            </div>
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {isSignedIn && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.fullName || 'Student'}</h2>
                <p className="text-blue-100">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> Grade {selectedGrade}</span>
                  <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {progress.points} XP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isSignedIn && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Sign in to save progress</h2>
                <p className="text-blue-100">Create an account to track your learning journey</p>
              </div>
              <Link href="/sign-up" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Level</label>
              <div className="flex gap-2">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleGradeChange(grade)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedGrade === grade ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Grade {grade}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Region (for Competition)</label>
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              >
                {REGIONS.map((region) => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">Your region determines qualification for regional competition finals</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {resolvedTheme === 'dark' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                <p className="text-sm text-gray-500">Choose system, light, or dark mode</p>
              </div>
            </div>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {['system', 'light', 'dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded text-sm font-medium capitalize ${
                    activeTheme === t ? 'bg-white dark:bg-gray-700 shadow' : ''
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {progress.settings.notifications ? <Bell className="w-5 h-5 text-gray-600" /> : <BellOff className="w-5 h-5 text-gray-600" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                <p className="text-sm text-gray-500">Get reminders and achievement alerts</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ notifications: !progress.settings.notifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${progress.settings.notifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${progress.settings.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Video Playback</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Play className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Autoplay Videos</p>
                  <p className="text-sm text-gray-500">Automatically play the next lesson</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ autoplay: !progress.settings.autoplay })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${progress.settings.autoplay ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${progress.settings.autoplay ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Default Playback Speed</p>
                <p className="text-sm text-gray-500">Set your preferred video speed</p>
              </div>
              <select
                value={progress.settings.playbackSpeed}
                onChange={(e) => updateSettings({ playbackSpeed: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <option key={s} value={s}>{s}x</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Study Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{progress.completedLessons.length}</p>
              <p className="text-sm text-gray-600">Lessons</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{progress.points}</p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{progress.streak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{progress.badges.length}</p>
              <p className="text-sm text-gray-600">Badges</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{isSignedIn ? 'Manage your account' : 'Create an account'}</p>
                <p className="text-sm text-gray-500">{isSignedIn ? 'Update profile, password, security' : 'Sign up to save progress'}</p>
              </div>
            </div>
            {isSignedIn ? (
              <Link href="/settings/account" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Manage Account
              </Link>
            ) : (
              <Link href="/sign-up" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Sign Up
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Download className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Export Data</p>
                  <p className="text-sm text-gray-500">Download all your learning data</p>
                </div>
              </div>
              <button onClick={handleExportData} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                Export
              </button>
            </div>
            {showResetConfirm ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/60">
                <p className="font-medium text-red-900 dark:text-red-200 mb-2">Reset all progress?</p>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">This will delete all completed lessons, points, badges, and quiz scores.</p>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Yes, Reset</button>
                  <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowResetConfirm(true)} className="w-full flex items-center justify-center gap-2 p-3 border border-red-200 dark:border-red-900/60 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30">
                <RotateCcw className="w-4 h-4" /> Reset All Progress
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">About</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <Info className="w-5 h-5" />
              <div><p className="font-medium text-gray-900 dark:text-gray-100">Agentic Learning</p><p className="text-sm">Version 1.0.0</p></div>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <Shield className="w-5 h-5" />
              <div><p className="font-medium text-gray-900 dark:text-gray-100">Privacy Policy</p><p className="text-sm">Your data stays on your device</p></div>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <HelpCircle className="w-5 h-5" />
              <div><p className="font-medium text-gray-900 dark:text-gray-100">Help & Support</p><p className="text-sm">Get help with using the app</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
