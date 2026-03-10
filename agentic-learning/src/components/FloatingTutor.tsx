'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot,
  X,
  Send,
  User,
  ChevronDown,
  Brain,
  Target,
  Lightbulb,
  RefreshCw,
  HelpCircle,
  Calendar,
  Search,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Heart,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const agenticModes = [
  { id: 'adaptive', icon: <Brain className="w-4 h-4" />, text: 'Learning Path', prompt: 'Create a personalized learning path for me based on my progress' },
  { id: 'goals', icon: <Target className="w-4 h-4" />, text: 'Set Goals', prompt: 'Help me set learning goals based on my current progress' },
  { id: 'quiz', icon: <Lightbulb className="w-4 h-4" />, text: 'Practice Quiz', prompt: 'Generate a practice quiz for' },
  { id: 'spaced-repetition', icon: <RefreshCw className="w-4 h-4" />, text: 'Review', prompt: 'What topics should I review based on spaced repetition?' },
  { id: 'socratic', icon: <HelpCircle className="w-4 h-4" />, text: 'Socratic', prompt: 'Use Socratic questioning to help me understand' },
  { id: 'study-plan', icon: <Calendar className="w-4 h-4" />, text: 'Study Plan', prompt: 'Create a study plan for this week' },
  { id: 'gap-analysis', icon: <Search className="w-4 h-4" />, text: 'Gap Analysis', prompt: 'Analyze my knowledge gaps and create a plan to fill them' },
];

const quickQuestions = [
  { icon: <BookOpen className="w-3 h-3" />, text: 'Explain quadratic equations' },
  { icon: <Calculator className="w-3 h-3" />, text: 'How do I calculate force?' },
  { icon: <FlaskConical className="w-3 h-3" />, text: 'What is photosynthesis?' },
  { icon: <Globe className="w-3 h-3" />, text: 'Describe the water cycle' },
  { icon: <Heart className="w-3 h-3" />, text: 'Explain DNA replication' },
];

function makeId(suffix: string) {
  return `${Date.now()}-${suffix}-${Math.random().toString(16).slice(2)}`;
}

export default function FloatingTutor() {
  const { progress } = useProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAgenticMode = async (modeId: string, prompt: string) => {
    if (isTyping) return;
    setShowModes(false);

    const userMessage: Message = {
      id: makeId('user'),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          message: prompt,
          type: modeId,
          context: {
            progress: {
              completedLessons: progress.completedLessons,
              quizScores: progress.quizScores,
              streak: progress.streak,
              level: progress.level,
              weakAreas: progress.analytics?.needsReview || [],
              strongAreas: progress.analytics?.masteredTopics || [],
            }
          }
        }),
      });

      const data: unknown = await response.json();
      let reply = "I couldn't generate a response. Try again.";
      if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        if (typeof record.reply === 'string') reply = record.reply;
      }

      const assistantMessage: Message = {
        id: makeId('assistant'),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: Message = {
        id: makeId('assistant'),
        role: 'assistant',
        content: 'Network error. Please check your connection.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (isTyping || !input.trim()) return;

    const userMessage: Message = {
      id: makeId('user'),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const textToSend = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          context: {
            progress: {
              completedLessons: progress.completedLessons,
              quizScores: progress.quizScores,
              streak: progress.streak,
              level: progress.level,
            }
          }
        }),
      });

      const data: unknown = await response.json();
      let reply = "I couldn't generate a response. Try again.";
      if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        if (typeof record.reply === 'string') reply = record.reply;
      }

      const assistantMessage: Message = {
        id: makeId('assistant'),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: Message = {
        id: makeId('assistant'),
        role: 'assistant',
        content: 'Network error. Please check your connection.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
        aria-label="Open AI Tutor"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[70vh]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <span className="font-semibold text-white text-sm">AI Study Tutor</span>
            </div>
            <Link
              href="/tutor"
              className="text-xs text-white/80 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Open Full View
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Ask me anything or use an agentic mode!
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickQuestions.slice(0, 4).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend()}
                      className="text-xs px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1 transition-colors text-left"
                    >
                      {q.icon}
                      <span className="truncate">{q.text.split(' ').slice(0, 3).join(' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-3 h-3 text-white" />
                  ) : (
                    <User className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[85%] p-2 rounded-xl text-xs ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="p-2">
              <button
                onClick={() => setShowModes(!showModes)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <span className="flex items-center gap-1">
                  <Brain className="w-3 h-3" /> Agentic Modes
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showModes ? 'rotate-180' : ''}`} />
              </button>
              
              {showModes && (
                <div className="grid grid-cols-2 gap-1 p-1">
                  {agenticModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleAgenticMode(mode.id, mode.prompt)}
                      disabled={isTyping}
                      className="text-xs px-2 py-1.5 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      {mode.icon}
                      {mode.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-2 pt-0 flex gap-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-xs dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50 text-white p-2 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
