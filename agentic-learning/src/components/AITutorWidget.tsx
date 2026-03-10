'use client';

import { useState, useRef, useEffect } from 'react';
import { useTutor } from './TutorContext';
import { X, Send, BookOpen, TrendingUp, FileText, Lightbulb, Loader2, AlertCircle, RefreshCw, Zap, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUser } from '@clerk/nextjs';

export default function AITutorWidget() {
  const { isOpen, setIsOpen, messages, isLoading, sendMessage, error, clearMessages } = useTutor();
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => setLocalError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent, type: 'tutor' | 'suggestions' | 'analytics' | 'report' = 'tutor') => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    setLocalError(null);
    await sendMessage(message, undefined, type);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const quickActions = [
    { label: 'Tutor', icon: BookOpen, type: 'tutor' as const, prompt: '' },
    { label: 'Suggest', icon: Lightbulb, type: 'suggestions' as const, prompt: 'Give me study suggestions based on my progress' },
    { label: 'Analytics', icon: TrendingUp, type: 'analytics' as const, prompt: 'Show my learning analytics and insights' },
    { label: 'Report', icon: FileText, type: 'report' as const, prompt: 'Generate my report card' },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.prompt) {
      setInput(action.prompt);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 animate-pulse"
        aria-label="Open AI Tutor"
      >
        <Zap className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold">AI Study Tutor</span>
            <p className="text-xs text-white/70">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearMessages}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
        {quickActions.map(action => (
          <button
            key={action.type}
            onClick={() => handleQuickAction(action)}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        ))}
      </div>

      {!userLoaded ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
          </div>
        </div>
      ) : !user ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Sign in to use the AI Tutor</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">Get personalized help with your studies</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Hello! I am your AI Study Tutor</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Ask me anything about your studies!</p>
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setInput("Explain derivatives in simple terms")}
                    className="block w-full text-left px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-medium">📚 Derivatives</span>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Explain derivatives in simple terms</p>
                  </button>
                  <button
                    onClick={() => setInput("Give me practice problems for integration")}
                    className="block w-full text-left px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <span className="text-purple-600 dark:text-purple-400 font-medium">✨ Integration</span>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Give me practice problems</p>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    } ${msg.role === 'assistant' ? 'markdown-content' : ''}`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: (props) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: (props) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                          h3: (props) => <h3 className="text-sm font-semibold mb-1 mt-2" {...props} />,
                          p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: (props) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: (props) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: (props) => <li className="mb-1" {...props} />,
                          code: (props) => <code className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs" {...props} />,
                          pre: (props) => <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mb-2 text-xs" {...props} />,
                          table: (props) => <table className="w-full border-collapse mb-2 text-xs" {...props} />,
                          th: (props) => <th className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-200 dark:bg-gray-700 text-left" {...props} />,
                          td: (props) => <td className="border border-gray-300 dark:border-gray-600 p-2" {...props} />,
                          strong: (props) => <strong className="font-semibold" {...props} />,
                          em: (props) => <em className="italic" {...props} />,
                          a: (props) => <a className="text-blue-600 dark:text-blue-400 underline" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {localError && (
              <div className="flex justify-start">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{localError}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
