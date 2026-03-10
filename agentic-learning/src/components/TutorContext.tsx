'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface PageContext {
  page: string;
  subject?: { id: string; name: string };
  course?: { id: string; name: string };
  lesson?: { id: string; name: string };
}

interface TutorContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  pageContext: PageContext | null;
  setPageContext: (context: PageContext | null) => void;
  sendMessage: (message: string, context?: { courseId?: string; lessonId?: string }, type?: 'tutor' | 'suggestions' | 'analytics' | 'report') => Promise<void>;
}

const STORAGE_KEY = 'agentic-learning-tutor-messages';
const MAX_MESSAGES = 50;

const TutorContext = createContext<TutorContextType | null>(null);

export function useTutor() {
  const context = useContext(TutorContext);
  if (!context) {
    throw new Error('useTutor must be used within TutorProvider');
  }
  return context;
}

export function usePageContext() {
  const { pageContext, setPageContext } = useTutor();
  
  const updateSubject = useCallback((id: string, name: string) => {
    setPageContext(pageContext ? { ...pageContext, subject: { id, name } } : null);
  }, [setPageContext, pageContext]);
  
  const updateCourse = useCallback((id: string, name: string) => {
    setPageContext(pageContext ? { ...pageContext, course: { id, name } } : null);
  }, [setPageContext, pageContext]);
  
  const updateLesson = useCallback((id: string, name: string) => {
    setPageContext(pageContext ? { ...pageContext, lesson: { id, name } } : null);
  }, [setPageContext, pageContext]);
  
  return { pageContext, updateSubject, updateCourse, updateLesson };
}

export function TutorProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);

  useEffect(() => {
    const getPageContextFromPath = (path: string): PageContext => {
      const segments = path.split('/').filter(Boolean);
      
      if (segments.length === 0 || path === '/') {
        return { page: 'home', subject: undefined, course: undefined, lesson: undefined };
      }
      
      if (segments[0] === 'subject' && segments[1]) {
        return { page: 'subject', subject: { id: segments[1], name: '' }, course: undefined, lesson: undefined };
      }
      
      if (segments[0] === 'course' && segments[1]) {
        return { page: 'course', subject: undefined, course: { id: segments[1], name: '' }, lesson: undefined };
      }
      
      if (segments[0] === 'lesson' && segments[1]) {
        return { page: 'lesson', subject: undefined, course: undefined, lesson: { id: segments[1], name: '' } };
      }
      
      if (segments[0] === 'tutor') {
        return { page: 'tutor' };
      }
      
      if (segments[0] === 'achievements') {
        return { page: 'achievements' };
      }
      
      if (segments[0] === 'settings') {
        return { page: 'settings' };
      }
      
      return { page: segments[0] || 'unknown' };
    };
    
    setPageContext(getPageContextFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-MAX_MESSAGES));
        }
      } catch {
        setMessages([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    }
  }, [messages, isLoaded]);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }].slice(-MAX_MESSAGES));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendMessage = useCallback(async (message: string, context?: { courseId?: string; lessonId?: string }, type: 'tutor' | 'suggestions' | 'analytics' | 'report' = 'tutor') => {
    setIsLoading(true);
    setError(null);
    addMessage('user', message);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, context, type, pageContext }),
      });

      const data = await response.json();
      
      if (data.reply) {
        addMessage('assistant', data.reply);
      } else if (data.error) {
        const errorMsg = data.error || 'Sorry, I encountered an error. Please try again.';
        setError(errorMsg);
        addMessage('assistant', errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Failed to connect. Please check your internet connection.';
      setError(errorMsg);
      addMessage('assistant', errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [messages, addMessage, pageContext]);

  return (
    <TutorContext.Provider value={{ isOpen, setIsOpen, messages, addMessage, clearMessages, isLoading, error, setError, pageContext, setPageContext, sendMessage }}>
      {children}
    </TutorContext.Provider>
  );
}
