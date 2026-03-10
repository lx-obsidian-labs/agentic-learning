'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Bot,
  Calculator,
  Check,
  ChevronLeft,
  Copy,
  FlaskConical,
  Globe,
  Heart,
  Lightbulb,
  Send,
  User,
  Target,
  Brain,
  Clock,
  RefreshCw,
  HelpCircle,
  Calendar,
  Search,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { icon: <BookOpen className="w-4 h-4" />, text: 'Explain quadratic equations' },
  { icon: <Calculator className="w-4 h-4" />, text: 'How do I calculate force?' },
  { icon: <FlaskConical className="w-4 h-4" />, text: 'What is photosynthesis?' },
  { icon: <Globe className="w-4 h-4" />, text: 'Describe the water cycle' },
  { icon: <Heart className="w-4 h-4" />, text: 'Explain DNA replication' },
  { icon: <Lightbulb className="w-4 h-4" />, text: 'What is supply and demand?' },
];

const agenticModes = [
  { 
    id: 'adaptive', 
    icon: <Brain className="w-4 h-4" />, 
    text: 'Learning Path',
    description: 'Get personalized learning path',
    prompt: 'Create a personalized learning path for me based on my progress'
  },
  { 
    id: 'goals', 
    icon: <Target className="w-4 h-4" />, 
    text: 'Set Goals',
    description: 'Set achievable study goals',
    prompt: 'Help me set learning goals based on my current progress'
  },
  { 
    id: 'quiz', 
    icon: <Lightbulb className="w-4 h-4" />, 
    text: 'Practice Quiz',
    description: 'Generate practice questions',
    prompt: 'Generate a practice quiz for'
  },
  { 
    id: 'spaced-repetition', 
    icon: <RefreshCw className="w-4 h-4" />, 
    text: 'Review',
    description: 'Spaced repetition review',
    prompt: 'What topics should I review based on spaced repetition?'
  },
  { 
    id: 'socratic', 
    icon: <HelpCircle className="w-4 h-4" />, 
    text: 'Socratic',
    description: 'Guided learning',
    prompt: 'Use Socratic questioning to help me understand'
  },
  { 
    id: 'study-plan', 
    icon: <Calendar className="w-4 h-4" />, 
    text: 'Study Plan',
    description: 'Create study schedule',
    prompt: 'Create a study plan for this week'
  },
  { 
    id: 'gap-analysis', 
    icon: <Search className="w-4 h-4" />, 
    text: 'Gap Analysis',
    description: 'Find knowledge gaps',
    prompt: 'Analyze my knowledge gaps and create a plan to fill them'
  },
];

function makeId(suffix: string) {
  return `${Date.now()}-${suffix}-${Math.random().toString(16).slice(2)}`;
}

export default function TutorPage() {
  const { progress } = useProgress();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your AI Study Tutor. I'm here to help you understand any concept from your subjects. Ask me anything about Math, Physics, Life Sciences, or Geography!\n\n💡 You can also try my agentic modes:\n• **Learning Path** - Get a personalized study path\n• **Set Goals** - Set achievable targets\n• **Practice Quiz** - Generate questions\n• **Review** - Spaced repetition tips\n• **Socratic** - Guided learning\n• **Study Plan** - Weekly schedule\n• **Gap Analysis** - Find weak areas",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAgenticMode = async (modeId: string, prompt: string) => {
    if (isTyping) return;

    const mode = agenticModes.find(m => m.id === modeId);
    if (!mode) return;

    setActiveMode(modeId);

    const userMessage: Message = {
      id: makeId('user'),
      role: 'user',
      content: mode.prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          message: mode.prompt,
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

      const data: unknown = await response.json().catch(() => null);
      let reply = response.ok
        ? "I couldn't generate a response. Try again."
        : 'AI Tutor failed to respond. Please try again.';
      if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        if (typeof record.reply === 'string') reply = record.reply;
        else if (typeof record.error === 'string') reply = record.error;
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
        content: 'Network error. Please check your connection and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
      setActiveMode(null);
    }
  };

  const handleSend = async (overrideText?: string) => {
    if (isTyping) return;

    const text = (overrideText ?? input).trim();
    if (!text) return;

    const userMessage: Message = {
      id: makeId('user'),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data: unknown = await response.json().catch(() => null);
      let reply = response.ok
        ? "I couldn't generate a response. Try again."
        : 'AI Tutor failed to respond. Please try again.';
      if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        if (typeof record.reply === 'string') reply = record.reply;
        else if (typeof record.error === 'string') reply = record.error;
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
        content: 'Network error. Please check your connection and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Study Tutor</h1>
                <p className="text-xs text-white/60">Level {progress.level} • {progress.streak} day streak</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-4 flex flex-col"
          style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                      : 'bg-white/20'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => void copyToClipboard(message.content, message.id)}
                      className="mt-1 text-white/40 hover:text-white/70 text-xs flex items-center gap-1"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 text-white/60 p-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 space-y-4">
              <div>
                <p className="text-white/60 text-sm mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" /> Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => void handleSend(q.text)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {q.icon}
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm mb-2 flex items-center gap-1">
                  <Brain className="w-4 h-4" /> Agentic Modes:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {agenticModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => void handleAgenticMode(mode.id, mode.prompt)}
                      disabled={activeMode === mode.id}
                      className="px-3 py-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 text-white/90 text-sm rounded-lg flex flex-col items-start gap-0.5 transition-all disabled:opacity-50"
                    >
                      <span className="flex items-center gap-1.5">
                        {mode.icon}
                        {mode.text}
                      </span>
                      <span className="text-xs text-white/50">{mode.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleSend();
                  }}
                  placeholder="Ask me anything about your subjects..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-white/40 text-xs">Press Enter to send • Get instant help with any topic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
