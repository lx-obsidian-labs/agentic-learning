'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CourseCardDTO, SubjectDTO } from '@/lib/catalogTypes';
import { Brain, CalendarDays, ChevronLeft, ChevronRight, Target, Clock, CheckCircle2 } from 'lucide-react';

type ThemePreference = 'system' | 'light' | 'dark';

type OnboardingData = {
  version: 1;
  selectedSubjects: string[];
  examDate: string; // YYYY-MM-DD
  hoursPerWeek: number;
  targetMark: number;
  themePreference: ThemePreference;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = 'agentic-learning-onboarding-v1';

function getDefaultExamDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const defaultDate = new Date(Date.UTC(year, 10, 1)); // Nov 1
  return defaultDate.toISOString().slice(0, 10);
}

function loadOnboarding(): OnboardingData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingData>;
    if (parsed.version !== 1) return null;
    if (!Array.isArray(parsed.selectedSubjects)) return null;
    if (typeof parsed.examDate !== 'string') return null;
    if (typeof parsed.hoursPerWeek !== 'number') return null;
    if (typeof parsed.targetMark !== 'number') return null;
    if (parsed.themePreference !== 'system' && parsed.themePreference !== 'light' && parsed.themePreference !== 'dark') {
      return null;
    }
    if (typeof parsed.createdAt !== 'number' || typeof parsed.updatedAt !== 'number') return null;
    return parsed as OnboardingData;
  } catch {
    return null;
  }
}

function saveOnboarding(data: OnboardingData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function OnboardingPage() {
  const router = useRouter();
  const [catalogSubjects, setCatalogSubjects] = useState<SubjectDTO[]>([]);
  const [catalogCourses, setCatalogCourses] = useState<CourseCardDTO[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [examDate, setExamDate] = useState(getDefaultExamDate());
  const [hoursPerWeek, setHoursPerWeek] = useState(6);
  const [targetMark, setTargetMark] = useState(75);
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');

  useEffect(() => {
    const existing = loadOnboarding();
    if (!existing) return;
    setSelectedSubjects(existing.selectedSubjects);
    setExamDate(existing.examDate);
    setHoursPerWeek(existing.hoursPerWeek);
    setTargetMark(existing.targetMark);
    setThemePreference(existing.themePreference);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setCatalogLoading(true);
        setCatalogError(null);

        const [subjectsRes, coursesRes] = await Promise.all([
          fetch('/api/catalog/subjects', { signal: controller.signal }),
          fetch('/api/catalog/courses', { signal: controller.signal }),
        ]);

        if (!subjectsRes.ok) throw new Error('Failed to load subjects');
        if (!coursesRes.ok) throw new Error('Failed to load courses');

        const [subjectsData, coursesData] = (await Promise.all([
          subjectsRes.json(),
          coursesRes.json(),
        ])) as [SubjectDTO[], CourseCardDTO[]];

        setCatalogSubjects(subjectsData);
        setCatalogCourses(coursesData);
      } catch (err) {
        if (controller.signal.aborted) return;
        setCatalogError(err instanceof Error ? err.message : 'Failed to load catalog');
      } finally {
        if (!controller.signal.aborted) setCatalogLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  const recommendedCourse = useMemo(() => {
    const preferredSubject = selectedSubjects[0];
    const match = catalogCourses.find(c => (preferredSubject ? c.subjectId === preferredSubject : true));
    return match ?? catalogCourses[0] ?? null;
  }, [selectedSubjects, catalogCourses]);

  const canContinue = useMemo(() => {
    if (step === 1) return selectedSubjects.length > 0;
    return true;
  }, [step, selectedSubjects.length]);

  const persist = () => {
    const now = Date.now();
    const existing = loadOnboarding();
    const payload: OnboardingData = {
      version: 1,
      selectedSubjects,
      examDate,
      hoursPerWeek,
      targetMark,
      themePreference,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    saveOnboarding(payload);
  };

  const next = () => {
    if (!canContinue) return;
    persist();
    setStep(s => Math.min(4, s + 1));
  };

  const back = () => setStep(s => Math.max(0, s - 1));

  const startLearning = () => {
    persist();
    if (!recommendedCourse) {
      router.push('/');
      return;
    }
    router.push(`/course/${recommendedCourse.id}`);
  };

  const progressPct = Math.round(((Math.min(step, 4) + 1) / 5) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Get started</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Set up your study plan in ~3 minutes</p>
              </div>
            </div>
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Skip
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Step {step + 1} of 5</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{progressPct}%</p>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="p-6">
            {step === 0 && (
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Brain className="w-4 h-4" />
                    Personalized setup
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-3">Learn smarter, starting today</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Choose your subjects and goals. We&apos;ll generate a simple plan and take you straight to the best first lesson.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Start setup
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 px-5 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Browse first
                    </Link>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
                  <p className="text-blue-100 text-sm mb-2">What you&apos;ll get</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5" />
                      <span>Recommended first lesson based on your subjects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5" />
                      <span>A weekly study time target that fits your schedule</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5" />
                      <span>Clear progress tracking and quick quizzes</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pick your subjects</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Select at least one. You can change this later.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogSubjects.map(subject => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    return (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => {
                          setSelectedSubjects(prev =>
                            prev.includes(subject.id) ? prev.filter(s => s !== subject.id) : [...prev, subject.id]
                          );
                        }}
                        className={`text-left rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 dark:bg-blue-950/30'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{subject.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{subject.description}</p>
                          </div>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: subject.color }}
                          >
                            {subject.name.slice(0, 1)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{subject.courseCount} courses</p>
                      </button>
                    );
                  })}
                </div>

                {catalogLoading && catalogSubjects.length === 0 && (
                  <p className="text-sm text-gray-500 mt-4">Loading subjects...</p>
                )}
                {catalogError && (
                  <p className="text-sm text-red-600 mt-4">{catalogError}</p>
                )}

                {!canContinue && (
                  <p className="text-sm text-red-600 mt-4">Select at least one subject to continue.</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Set your schedule</h2>
                    <p className="text-gray-500 text-sm">We&apos;ll use this to shape your weekly plan.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Matric exam date</label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">Pick your expected exam start date.</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                      <span>Hours per week</span>
                      <span className="text-gray-900 font-semibold">{hoursPerWeek}h</span>
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={25}
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>2h</span>
                      <span>25h</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Your plan preview
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Aim for ~{Math.max(15, Math.round((hoursPerWeek * 60) / 5))} minutes per day, 5 days a week.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Set your goal</h2>
                    <p className="text-gray-500 text-sm">A clear target helps the study plan stay realistic.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                    <span>Target mark</span>
                    <span className="text-gray-900 font-semibold">{targetMark}%</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={1}
                    value={targetMark}
                    onChange={(e) => setTargetMark(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tip: If you’re aiming for 80%+, prioritize “Must‑Watch” lessons first, then do quizzes immediately after.
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">You&apos;re ready</h2>
                    <p className="text-gray-500 text-sm">Here’s a simple plan to start strong today.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 p-6 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                    <p className="text-blue-100 text-sm mb-1">Recommended first course</p>
                    <p className="text-2xl font-bold mb-2">{recommendedCourse?.title ?? 'Browse courses'}</p>
                    <p className="text-blue-100 text-sm">
                      Start with lesson 1, then take a quick quiz to lock it in.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Today’s plan</p>
                    <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">1</span>
                        <span>Watch the first “Must‑Watch” lesson (25–35 minutes).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">2</span>
                        <span>Read the key points and copy any formulas you’ll reuse.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold flex-shrink-0">3</span>
                        <span>Take the quiz and aim for 70%+.</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={startLearning}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Start learning
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={next}
                disabled={!canContinue}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gray-900 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={startLearning}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800"
              >
                Start
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
