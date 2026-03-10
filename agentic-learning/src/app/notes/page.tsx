'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import type { Pluggable } from 'unified';
import { ChevronLeft, BookOpen, Search, ChevronRight, CheckCircle2, Plus, Edit3, Trash2, Download, Save, X } from 'lucide-react';
import type { LessonCardDTO, LessonDetailDTO, SubjectDTO } from '@/lib/catalogTypes';

interface UserNote {
  id: string;
  title: string;
  content: string;
  subject: string;
  topic: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'agentic-learning-user-notes';

type DetailStatus = 'idle' | 'loading' | 'error';

export default function NotesPage() {
  const { progress } = useProgress();
  const [subjects, setSubjects] = useState<SubjectDTO[]>([]);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const [results, setResults] = useState<LessonCardDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [detailsById, setDetailsById] = useState<Record<string, LessonDetailDTO>>({});
  const [detailStatusById, setDetailStatusById] = useState<Record<string, DetailStatus>>({});
  const [detailErrorById, setDetailErrorById] = useState<Record<string, string>>({});

  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '', topic: '' });
  const [viewTab, setViewTab] = useState<'lesson' | 'personal'>('lesson');

  const markdownPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const htmlPlugins = useMemo(() => [rehypeSanitize, rehypeKatex] as Pluggable[], []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserNotes(parsed);
      } catch {
        setUserNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    if (userNotes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userNotes));
    }
  }, [userNotes]);

  const handleSaveNote = () => {
    if (!newNote.title.trim()) return;

    const now = Date.now();
    
    if (editingNoteId) {
      setUserNotes(userNotes.map(note => 
        note.id === editingNoteId 
          ? { ...note, title: newNote.title, content: newNote.content, subject: newNote.subject || 'General', topic: newNote.topic || 'General', updatedAt: now }
          : note
      ));
    } else {
      const note: UserNote = {
        id: `note-${now}`,
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject || 'General',
        topic: newNote.topic || 'General',
        createdAt: now,
        updatedAt: now
      };
      setUserNotes([...userNotes, note]);
    }

    setNewNote({ title: '', content: '', subject: '', topic: '' });
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  const handleEditNote = (note: UserNote) => {
    setNewNote({ title: note.title, content: note.content, subject: note.subject, topic: note.topic });
    setEditingNoteId(note.id);
    setIsAddingNote(true);
  };

  const handleDeleteNote = (id: string) => {
    setUserNotes(userNotes.filter(note => note.id !== id));
  };

  const exportNoteAsText = (note: UserNote) => {
    const content = `# ${note.title}\n\nSubject: ${note.subject}\nTopic: ${note.topic}\n\n${note.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const controller = new AbortController();
    setSubjectsError(null);

    fetch('/api/catalog/subjects', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load subjects (${res.status})`);
        const data = (await res.json()) as SubjectDTO[];
        setSubjects(data);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string } | null)?.name === 'AbortError') return;
        setSubjectsError(err instanceof Error ? err.message : 'Failed to load subjects');
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const handle = setTimeout(() => {
      setIsSearching(true);
      setSearchError(null);

      const params = new URLSearchParams({ query, limit: '50' });
      if (selectedSubject !== 'all') params.set('subjectId', selectedSubject);

      fetch(`/api/catalog/lessons/search?${params.toString()}`, { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Search failed (${res.status})`);
          const data = (await res.json()) as LessonCardDTO[];
          setResults(data);
        })
        .catch((err: unknown) => {
          if ((err as { name?: string } | null)?.name === 'AbortError') return;
          setSearchError(err instanceof Error ? err.message : 'Search failed');
        })
        .finally(() => setIsSearching(false));
    }, 250);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [searchQuery, selectedSubject]);

  const loadLessonDetail = async (lessonId: string) => {
    if (detailsById[lessonId]) return;
    if (detailStatusById[lessonId] === 'loading') return;

    setDetailStatusById((prev) => ({ ...prev, [lessonId]: 'loading' }));
    setDetailErrorById((prev) => {
      const next = { ...prev };
      delete next[lessonId];
      return next;
    });

    try {
      const res = await fetch(`/api/catalog/lessons/${encodeURIComponent(lessonId)}`);
      if (!res.ok) throw new Error(`Failed to load notes (${res.status})`);
      const data = (await res.json()) as LessonDetailDTO;
      setDetailsById((prev) => ({ ...prev, [lessonId]: data }));
      setDetailStatusById((prev) => ({ ...prev, [lessonId]: 'idle' }));
    } catch (err: unknown) {
      setDetailStatusById((prev) => ({ ...prev, [lessonId]: 'error' }));
      setDetailErrorById((prev) => ({
        ...prev,
        [lessonId]: err instanceof Error ? err.message : 'Failed to load notes',
      }));
    }
  };

  const queryIsActive = searchQuery.trim().length >= 2;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Notes</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {viewTab === 'personal' ? `${userNotes.length} personal notes` : (queryIsActive ? `${results.length} results` : 'Search across all lesson notes')}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setIsAddingNote(true); setEditingNoteId(null); setNewNote({ title: '', content: '', subject: '', topic: '' }); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewTab('lesson')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewTab === 'lesson' 
                ? 'bg-gray-900 text-white' 
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Lesson Notes
          </button>
          <button
            onClick={() => setViewTab('personal')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewTab === 'personal' 
                ? 'bg-gray-900 text-white' 
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
            }`}
          >
            <Edit3 className="w-4 h-4 inline mr-2" />
            My Notes ({userNotes.length})
          </button>
        </div>

        {isAddingNote && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              {editingNoteId ? 'Edit Note' : 'Add New Note'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Enter note title..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Content (Markdown supported)</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your notes here... (Markdown supported)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Subject</label>
                  <input
                    type="text"
                    value={newNote.subject}
                    onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">Topic</label>
                  <input
                    type="text"
                    value={newNote.topic}
                    onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
                    placeholder="e.g., Calculus"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNote}
                  disabled={!newNote.title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingNoteId ? 'Save Changes' : 'Save Note'}
                </button>
                <button
                  onClick={() => { setIsAddingNote(false); setEditingNoteId(null); setNewNote({ title: '', content: '', subject: '', topic: '' }); }}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {viewTab === 'personal' && !isAddingNote && (
          <div className="space-y-4 mb-8">
            {userNotes.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <Edit3 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No personal notes yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Create your own study notes</p>
                <button
                  onClick={() => { setIsAddingNote(true); setEditingNoteId(null); setNewNote({ title: '', content: '', subject: '', topic: '' }); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Note
                </button>
              </div>
            ) : (
              userNotes.map(note => (
                <div key={note.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{note.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{note.subject} • {note.topic}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportNoteAsText(note)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                        title="Export as Markdown"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="prose prose-gray max-w-none dark:prose-invert">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Created: {new Date(note.createdAt).toLocaleDateString()} • Updated: {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {viewTab === 'lesson' && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes (e.g. derivatives, DNA, equilibrium)…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
              disabled={Boolean(subjectsError)}
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {viewTab === 'lesson' && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {!queryIsActive ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Search lesson notes</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Type at least 2 characters to search across lesson titles and notes.
                </p>
                {subjectsError && (
                  <p className="mt-3 text-sm text-red-600">Subjects list unavailable: {subjectsError}</p>
                )}
              </div>
            ) : isSearching ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-300">Searching…</p>
              </div>
            ) : searchError ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Search failed</h3>
                <p className="text-gray-500 dark:text-gray-400">{searchError}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No notes found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or subject filter.</p>
              </div>
            ) : (
              results.map((item) => {
                const isCompleted = progress.completedLessons.includes(item.id);
                const detail = detailsById[item.id];
                const detailStatus = detailStatusById[item.id] ?? 'idle';
                const detailError = detailErrorById[item.id];

                return (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-100' : 'bg-blue-100'
                          }`}
                        >
                          <BookOpen className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                            {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {item.courseTitle} • {item.moduleTitle}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.keyPoints.slice(0, 4).map((kp, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-300 rounded"
                              >
                                {kp}
                              </span>
                            ))}
                          </div>

                          <details
                            className="group"
                            onToggle={(e) => {
                              const open = (e.currentTarget as HTMLDetailsElement).open;
                              if (open) void loadLessonDetail(item.id);
                            }}
                          >
                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              View Notes
                            </summary>

                            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
                              {detail ? (
                                <div className="prose prose-gray max-w-none dark:prose-invert">
                                  <ReactMarkdown
                                    remarkPlugins={markdownPlugins}
                                    rehypePlugins={htmlPlugins}
                                    components={{
                                      a({ href, children, ...props }) {
                                        const safeHref =
                                          href &&
                                          (href.startsWith('https://') ||
                                            href.startsWith('http://') ||
                                            href.startsWith('mailto:'))
                                            ? href
                                            : undefined;
                                        if (!safeHref) return <span {...props}>{children}</span>;
                                        return (
                                          <a href={safeHref} target="_blank" rel="noreferrer noopener" {...props}>
                                            {children}
                                          </a>
                                        );
                                      },
                                    }}
                                  >
                                    {detail.notesMarkdown}
                                  </ReactMarkdown>
                                </div>
                              ) : detailStatus === 'loading' ? (
                                <p className="text-sm text-gray-600 dark:text-gray-300">Loading notes…</p>
                              ) : detailStatus === 'error' ? (
                                <div className="text-sm">
                                  <p className="text-red-600 mb-3">{detailError ?? 'Failed to load notes.'}</p>
                                  <button
                                    type="button"
                                    onClick={() => void loadLessonDetail(item.id)}
                                    className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                  >
                                    Retry
                                  </button>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-300">Open to load notes.</p>
                              )}
                            </div>
                          </details>
                        </div>
                      </div>

                      <Link
                        href={`/course/${item.courseId}`}
                        className="ml-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                      >
                        Go to Lesson
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

