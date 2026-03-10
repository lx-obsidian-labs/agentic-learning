'use client';

import { useState } from 'react';
import { useUser, UserButton, UserProfile } from '@clerk/nextjs';
import { getOptimizedImageUrl } from '@/lib/clerk';
import { 
  ChevronLeft,
  User,
  Mail,
  Lock,
  Shield,
  CreditCard,
  Trash2,
  LogOut,
  Settings,
  Bell,
  Key,
  Smartphone,
  Link as LinkIcon,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function AccountSettingsPage() {
  const { isSignedIn, user } = useUser();
  const [activeSection, setActiveSection] = useState('profile');

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sign in to manage account</h2>
          <Link 
            href="/sign-in"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/settings" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile and security</p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-2">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-col-xlors ${
                    activeSection === 'profile'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === 'security'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Security</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('emails')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === 'emails'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email Addresses</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === 'password'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Password</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('2fa')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === '2fa'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="font-medium">Two-Factor Auth</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('connected')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === 'connected'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <LinkIcon className="w-5 h-5" />
                  <span className="font-medium">Connected Accounts</span>
                </button>
                
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                
                <button
                  onClick={() => setActiveSection('danger')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === 'danger'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Delete Account</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {activeSection === 'profile' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        {user?.imageUrl ? (
                          <img src={getOptimizedImageUrl(user.imageUrl, { width: 96, height: 96 })} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.fullName}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                        <p className="text-sm text-gray-400 mt-1">Member since {user?.createdAt?.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                          <input 
                            type="text" 
                            defaultValue={user?.firstName || ''}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                          <input 
                            type="text" 
                            defaultValue={user?.lastName || ''}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                            placeholder="Last name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input 
                          type="text" 
                          defaultValue={user?.username || ''}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                          placeholder="username"
                        />
                      </div>
                      
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account security</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Enable
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <Key className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Active Sessions</p>
                          <p className="text-sm text-gray-500">Manage your logged in devices</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        View
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                          <LogOut className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Sign Out Everywhere</p>
                          <p className="text-sm text-gray-500">Sign out from all devices</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'emails' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Addresses</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your email addresses</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {user?.emailAddresses.map((email, idx) => (
                        <div key={email.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{email.emailAddress}</p>
                              <p className="text-sm text-gray-500">{idx === 0 ? 'Primary email' : 'Secondary email'}</p>
                            </div>
                          </div>
                          {idx === 0 && (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                      <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5" />
                        Add Email Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'password' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Change your password</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {activeSection === '2fa' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Add extra security to your account</p>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No two-factor authentication</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Add an extra layer of security by enabling two-factor authentication
                      </p>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Enable Two-Factor Auth
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'connected' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connected Accounts</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Link your social accounts</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            G
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Google</p>
                            <p className="text-sm text-gray-500">Not connected</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          Connect
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                            A
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Apple</p>
                            <p className="text-sm text-gray-500">Not connected</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'danger' && (
                <div>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-red-50 dark:bg-red-900/10">
                    <h2 className="text-xl font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Irreversible actions</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <h3 className="font-medium text-red-900 dark:text-red-200 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                        All your data, progress, and achievements will be permanently deleted.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                        Delete My Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
