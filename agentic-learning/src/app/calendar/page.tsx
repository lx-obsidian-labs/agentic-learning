'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Target,
  Check,
  X,
  Trash2,
  Edit3,
  Save,
  Brain,
  Zap
} from 'lucide-react';

interface StudySession {
  id: string;
  title: string;
  subject: string;
  topic: string;
  date: string;
  startTime: string;
  duration: number;
  completed: boolean;
  type: 'lesson' | 'quiz' | 'review' | 'practice';
}

const STORAGE_KEY = 'agentic-learning-study-schedule';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [newSession, setNewSession] = useState<{
    title: string;
    subject: string;
    topic: string;
    date: string;
    startTime: string;
    duration: number;
    type: 'lesson' | 'quiz' | 'review' | 'practice';
  }>({
    title: '',
    subject: '',
    topic: '',
    date: '',
    startTime: '09:00',
    duration: 30,
    type: 'lesson'
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
      } catch {
        setSessions([]);
      }
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getSessionsForDate = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return sessions.filter(s => s.date === dateKey);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500';
      case 'quiz': return 'bg-purple-500';
      case 'review': return 'bg-orange-500';
      case 'practice': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-3 h-3" />;
      case 'quiz': return <Target className="w-3 h-3" />;
      case 'review': return <Brain className="w-3 h-3" />;
      case 'practice': return <Zap className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleAddSession = () => {
    if (!newSession.title.trim() || !newSession.date) return;

    const session: StudySession = {
      id: `session-${Date.now()}`,
      title: newSession.title,
      subject: newSession.subject || 'General',
      topic: newSession.topic || 'General',
      date: newSession.date,
      startTime: newSession.startTime,
      duration: newSession.duration,
      completed: false,
      type: newSession.type
    };

    setSessions([...sessions, session]);
    setNewSession({ title: '', subject: '', topic: '', date: '', startTime: '09:00', duration: 30, type: 'lesson' });
    setIsAddingSession(false);
  };

  const handleToggleComplete = (id: string) => {
    setSessions(sessions.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleEditSession = (session: StudySession) => {
    setNewSession({
      title: session.title,
      subject: session.subject,
      topic: session.topic,
      date: session.date,
      startTime: session.startTime,
      duration: session.duration,
      type: session.type
    });
    setEditingSession(session);
    setIsAddingSession(true);
  };

  const handleSaveEdit = () => {
    if (!editingSession || !newSession.title.trim()) return;

    setSessions(sessions.map(s => 
      s.id === editingSession.id 
        ? { 
            ...s, 
            title: newSession.title, 
            subject: newSession.subject || 'General',
            topic: newSession.topic || 'General',
            date: newSession.date,
            startTime: newSession.startTime,
            duration: newSession.duration,
            type: newSession.type
          } 
        : s
    ));

    setNewSession({ title: '', subject: '', topic: '', date: '', startTime: '09:00', duration: 30, type: 'lesson' });
    setEditingSession(null);
    setIsAddingSession(false);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const selectedDateSessions = selectedDate 
    ? sessions.filter(s => s.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Study Calendar</h1>
                <p className="text-xs text-white/60">{sessions.length} scheduled sessions</p>
              </div>
            </div>
            <button
              onClick={() => { setIsAddingSession(true); setEditingSession(null); setNewSession({ title: '', subject: '', topic: '', date: selectedDate || '', startTime: '09:00', duration: 30, type: 'lesson' }); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Session
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-white/60 text-sm font-medium">
                    {day}
                  </div>
                ))}

                {days.map((day, idx) => {
                  const dateKey = day ? formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day) : '';
                  const daySessions = day ? getSessionsForDate(day) : [];
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedDate;

                  return (
                    <div
                      key={idx}
                      onClick={() => day && setSelectedDate(dateKey)}
                      className={`min-h-[80px] p-2 border-t border-r border-white/10 cursor-pointer transition-colors ${
                        day ? 'hover:bg-white/5' : 'bg-black/20'
                      } ${isSelected ? 'bg-blue-500/20' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
                            isToday ? 'bg-blue-500 text-white font-bold' : 'text-white'
                          }`}>
                            {day}
                          </div>
                          {daySessions.length > 0 && (
                            <div className="space-y-1">
                              {daySessions.slice(0, 2).map(session => (
                                <div
                                  key={session.id}
                                  className={`text-xs px-1.5 py-0.5 rounded ${getTypeColor(session.type)} text-white truncate ${session.completed ? 'opacity-50' : ''}`}
                                >
                                  {session.title}
                                </div>
                              ))}
                              {daySessions.length > 2 && (
                                <div className="text-xs text-white/50">+{daySessions.length - 2} more</div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {isAddingSession && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  {editingSession ? 'Edit Session' : 'Add Study Session'}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Title</label>
                    <input
                      type="text"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                      placeholder="e.g., Review Calculus"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Subject</label>
                      <input
                        type="text"
                        value={newSession.subject}
                        onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                        placeholder="e.g., Math"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Topic</label>
                      <input
                        type="text"
                        value={newSession.topic}
                        onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                        placeholder="e.g., Derivatives"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Date</label>
                    <input
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newSession.startTime}
                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Duration (min)</label>
                      <select
                        value={newSession.duration}
                        onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={15}>15 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>60 min</option>
                        <option value={90}>90 min</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Type</label>
                    <div className="flex gap-2">
                      {(['lesson', 'quiz', 'review', 'practice'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setNewSession({ ...newSession, type })}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-sm transition-colors ${
                            newSession.type === type 
                              ? getTypeColor(type) + ' text-white' 
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {getTypeIcon(type)}
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={editingSession ? handleSaveEdit : handleAddSession}
                      disabled={!newSession.title.trim() || !newSession.date}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {editingSession ? 'Save' : 'Add'}
                    </button>
                    <button
                      onClick={() => { setIsAddingSession(false); setEditingSession(null); }}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-lg font-bold text-white mb-4">
                {selectedDate ? `Sessions for ${selectedDate}` : 'Select a date'}
              </h3>
              
              {selectedDate ? (
                selectedDateSessions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateSessions.map(session => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-xl border border-white/10 ${session.completed ? 'bg-green-500/10' : 'bg-white/5'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => handleToggleComplete(session.id)}
                              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                session.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-white/30 hover:border-white/50'
                              }`}
                            >
                              {session.completed && <Check className="w-3 h-3" />}
                            </button>
                            <div>
                              <p className={`font-medium text-white ${session.completed ? 'line-through opacity-50' : ''}`}>
                                {session.title}
                              </p>
                              <p className="text-xs text-white/60">
                                {session.subject} • {session.topic}
                              </p>
                              <p className="text-xs text-white/60 mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {session.startTime} • {session.duration} min
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditSession(session)}
                              className="p-1.5 hover:bg-white/10 rounded"
                            >
                              <Edit3 className="w-3 h-3 text-white/50" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="p-1.5 hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-400/50" />
                            </button>
                          </div>
                        </div>
                        <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getTypeColor(session.type)} text-white`}>
                          {getTypeIcon(session.type)}
                          {session.type}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-center py-4">No sessions scheduled</p>
                )
              ) : (
                <p className="text-white/60 text-center py-4">Click on a date to view sessions</p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">{sessions.length}</p>
                  <p className="text-xs text-white/60">Total Sessions</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-green-400">{sessions.filter(s => s.completed).length}</p>
                  <p className="text-xs text-white/60">Completed</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-blue-400">
                    {sessions.filter(s => !s.completed && s.date === todayKey).length}
                  </p>
                  <p className="text-xs text-white/60">Today</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-orange-400">
                    {Math.round(sessions.filter(s => s.completed).length / Math.max(sessions.length, 1) * 100)}%
                  </p>
                  <p className="text-xs text-white/60">Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
