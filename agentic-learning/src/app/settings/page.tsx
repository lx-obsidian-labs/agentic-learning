'use client';

import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { 
  Moon, 
  Sun, 
  Monitor,
  Bell, 
  BellOff, 
  Play, 
  RotateCcw, 
  Trash2, 
  ChevronLeft,
  User,
  Volume2,
  VolumeX,
  Download,
  Shield,
  HelpCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { progress, updateSettings, resetProgress } = useProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const activeTheme = theme ?? 'system';
  const resolvedTheme = activeTheme === 'system' ? systemTheme : activeTheme;

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose system, light, or dark mode</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeTheme === 'system'
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="System"
                  >
                    <Monitor className="w-4 h-4" />
                    System
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeTheme === 'light'
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="Light"
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      activeTheme === 'dark'
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="Dark"
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {progress.settings.notifications ? (
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get reminders to study and achievement alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ notifications: !progress.settings.notifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    progress.settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    progress.settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Video Playback</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {progress.settings.autoplay ? (
                    <Play className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Autoplay Videos</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically play the next lesson</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ autoplay: !progress.settings.autoplay })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    progress.settings.autoplay ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    progress.settings.autoplay ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Default Playback Speed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Set your preferred video speed</p>
                  </div>
                  <select
                    value={progress.settings.playbackSpeed}
                    onChange={(e) => updateSettings({ playbackSpeed: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x (Normal)</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Study Statistics</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-blue-600">{progress.completedLessons.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Lessons Completed</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-purple-600">{progress.points}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Points</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-orange-600">{progress.streak}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-600">{progress.badges.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Badges Earned</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Account</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-xl border border-transparent dark:border-gray-800">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Student</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Learning since {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {showResetConfirm ? (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/60">
                  <p className="font-medium text-red-900 mb-3">Are you sure you want to reset all progress?</p>
                  <p className="text-sm text-red-700 mb-4">This will delete all your completed lessons, points, badges, and quiz scores.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Yes, Reset Everything
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 border border-red-200 dark:border-red-900/60 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Progress
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">About</h2>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                <Info className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Agentic Learning</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Version 1.0.0</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                <Shield className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Privacy Policy</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Your data stays on your device</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                <HelpCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Help & Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get help with using the app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
