'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'achievement' | 'competition' | 'reminder' | 'streak' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'agentic-learning-notifications';
const MAX_NOTIFICATIONS = 50;

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      } catch {
        setNotifications([]);
      }
    } else {
      const defaultNotifications: Notification[] = [
        {
          id: 'welcome',
          type: 'system',
          title: 'Welcome to Agentic Learning!',
          message: 'Start your learning journey today. Complete lessons to earn XP and badges!',
          read: false,
          createdAt: Date.now(),
          link: '/onboarding'
        },
        {
          id: 'competition',
          type: 'competition',
          title: 'Competition is Live!',
          message: 'The Matric Mastery Championship 2026 has started. Compete for R50,000 in prizes!',
          read: false,
          createdAt: Date.now() - 3600000,
          link: '/competition'
        }
      ];
      setNotifications(defaultNotifications);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)));
    }
  }, [notifications, isLoaded]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: Date.now(),
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
