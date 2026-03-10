'use client';

import { SignIn } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to continue your learning journey</p>
        </div>
        
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl',
              formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
              formFieldInput: 'bg-white/10 border-white/20 text-white placeholder:text-white/40',
              formFieldLabel: 'text-white/80',
              footerActionLink: 'text-blue-400 hover:text-blue-300',
              dividerLine: 'bg-white/20',
              dividerText: 'text-white/60',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-blue-400',
              otpCodeFieldInput: 'bg-white/10 border-white/20 text-white',
              formFieldInputShowPasswordButton: 'text-white/60',
              footer: 'text-white/60',
            }
          }}
          routing="hash"
        />
      </div>
    </div>
  );
}
