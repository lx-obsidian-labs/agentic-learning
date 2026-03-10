'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  BookOpen,
  Video,
  FileText,
  Target,
  Clock,
  BarChart3,
  GripVertical,
  ChevronRight
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  notesUrl?: string;
  duration: number;
  order: number;
  quiz?: {
    questions: number;
    passingScore: number;
  };
}

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  grade: number;
  thumbnail?: string;
  lessons: Lesson[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'agentic-learning-teacher-courses';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    subject: '',
    description: '',
    grade: 12
  });
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    duration: 30,
    videoUrl: '',
    quizQuestions: 5
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCourses(JSON.parse(stored));
      } catch {
        setCourses([]);
      }
    }
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses]);

  const handleCreateCourse = () => {
    if (!newCourse.title.trim() || !newCourse.subject.trim()) return;

    const now = Date.now();
    const course: Course = {
      id: `course-${now}`,
      title: newCourse.title,
      subject: newCourse.subject,
      description: newCourse.description,
      grade: newCourse.grade,
      lessons: [],
      createdAt: now,
      updatedAt: now
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', subject: '', description: '', grade: 12 });
    setIsCreating(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    if (expandedCourse === id) setExpandedCourse(null);
  };

  const handleAddLesson = (courseId: string) => {
    if (!newLesson.title.trim()) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: newLesson.title,
      description: newLesson.description,
      videoUrl: newLesson.videoUrl || undefined,
      duration: newLesson.duration,
      order: course.lessons.length + 1,
      quiz: {
        questions: newLesson.quizQuestions,
        passingScore: 80
      }
    };

    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          lessons: [...c.lessons, lesson],
          updatedAt: Date.now()
        };
      }
      return c;
    });

    setCourses(updatedCourses);
    setNewLesson({ title: '', description: '', duration: 30, videoUrl: '', quizQuestions: 5 });
    setIsAddingLesson(false);
  };

  const handleDeleteLesson = (courseId: string, lessonId: string) => {
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          lessons: c.lessons.filter(l => l.id !== lessonId).map((l, idx) => ({ ...l, order: idx + 1 })),
          updatedAt: Date.now()
        };
      }
      return c;
    });

    setCourses(updatedCourses);
  };

  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const totalDuration = courses.reduce((acc, c) => 
    acc + c.lessons.reduce((a, l) => a + l.duration, 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Teacher Portal</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Create and manage courses</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-gray-500">Total Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessons}</p>
                <p className="text-xs text-gray-500">Total Lessons</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalDuration / 60)}h</p>
                <p className="text-xs text-gray-500">Total Duration</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.reduce((a, c) => a + (c.lessons.some(l => l.quiz) ? 1 : 0), 0)}</p>
                <p className="text-xs text-gray-500">With Quizzes</p>
              </div>
            </div>
          </div>
        </div>

        {isCreating && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create New Course</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="e.g., Grade 12 Mathematics"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newCourse.subject}
                    onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Brief description of the course..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateCourse}
                  disabled={!newCourse.title.trim() || !newCourse.subject.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Create Course
                </button>
                <button
                  onClick={() => { setIsCreating(false); setNewCourse({ title: '', subject: '', description: '', grade: 12 }); }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No courses created yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start creating courses to organize your lessons and videos
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                >
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{course.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {course.subject} • Grade {course.grade} • {course.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingCourse(course); }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                    <button className="text-gray-400">
                      {expandedCourse === course.id ? (
                        <ChevronLeft className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Lessons</h4>
                      <button
                        onClick={() => setIsAddingLesson(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Lesson
                      </button>
                    </div>

                    {isAddingLesson && (
                      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-4">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Title</label>
                            <input
                              type="text"
                              value={newLesson.title}
                              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                              placeholder="e.g., Introduction to Derivatives"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                          <textarea
                              value={newLesson.description}
                              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                              placeholder="Brief description of this lesson..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (min)</label>
                              <input
                                type="number"
                                min={5}
                                max={180}
                                value={newLesson.duration}
                                onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 30 })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quiz Questions</label>
                              <input
                                type="number"
                                min={0}
                                max={20}
                                value={newLesson.quizQuestions}
                                onChange={(e) => setNewLesson({ ...newLesson, quizQuestions: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (optional)</label>
                            <input
                              type="url"
                              value={newLesson.videoUrl}
                              onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddLesson(course.id)}
                              disabled={!newLesson.title.trim()}
                              className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Save className="w-3 h-3" />
                              Add Lesson
                            </button>
                            <button
                              onClick={() => { setIsAddingLesson(false); setNewLesson({ title: '', description: '', duration: 30, videoUrl: '', quizQuestions: 5 }); }}
                              className="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {course.lessons.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No lessons yet. Add your first lesson above.</p>
                    ) : (
                      <div className="space-y-2">
                        {course.lessons.map((lesson, idx) => (
                          <div key={lesson.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm font-medium">#{lesson.order}</span>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{lesson.title}</p>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {lesson.duration} min
                                    </span>
                                    {lesson.quiz && (
                                      <span className="flex items-center gap-1">
                                        <Target className="w-3 h-3" />
                                        {lesson.quiz.questions} questions
                                      </span>
                                    )}
                                    {lesson.videoUrl && (
                                      <span className="flex items-center gap-1">
                                        <Video className="w-3 h-3" />
                                        Video
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteLesson(course.id, lesson.id)}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
