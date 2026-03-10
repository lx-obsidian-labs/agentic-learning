'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CircleCheck, CreditCard, PlusCircle, Store } from 'lucide-react';

type ServiceMode = 'online' | 'in_person';

type TeacherService = {
  id: string;
  mode: ServiceMode;
  title: string;
  description?: string | null;
  subjectSlug?: string | null;
  rateCents: number;
  sessionMinutes: number;
  city?: string | null;
  inPersonArea?: string | null;
  onlinePlatform?: string | null;
};

type TeacherProfileResponse = {
  teacher: {
    userId: string;
    headline?: string | null;
    bio?: string | null;
    hourlyRateCents: number;
    currency: string;
    verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
    registrationFeePaidAt?: string | null;
    isActive: boolean;
    services: TeacherService[];
  } | null;
};

function toCurrency(cents: number): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(cents / 100);
}

export default function TeachPage() {
  const [profile, setProfile] = useState<TeacherProfileResponse['teacher']>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRateCents, setHourlyRateCents] = useState(25000);

  const [mode, setMode] = useState<ServiceMode>('online');
  const [title, setTitle] = useState('Mathematics tutoring');
  const [description, setDescription] = useState('Focused tutoring to improve exam performance.');
  const [subjectSlug, setSubjectSlug] = useState('mathematics');
  const [serviceRateCents, setServiceRateCents] = useState(25000);
  const [sessionMinutes, setSessionMinutes] = useState(60);
  const [city, setCity] = useState('');
  const [inPersonArea, setInPersonArea] = useState('');
  const [onlinePlatform, setOnlinePlatform] = useState('Google Meet');

  async function loadProfile() {
    try {
      setLoading(true);
      const response = await fetch('/api/marketplace/teachers/me');
      if (!response.ok) throw new Error('Failed to load your teacher profile');
      const data = (await response.json()) as TeacherProfileResponse;
      setProfile(data.teacher);
      if (data.teacher) {
        setHeadline(data.teacher.headline ?? '');
        setBio(data.teacher.bio ?? '');
        setHourlyRateCents(data.teacher.hourlyRateCents);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function saveProfile() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/marketplace/teachers', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          headline,
          bio,
          hourlyRateCents,
          service: {
            mode,
            title,
            description,
            subjectSlug,
            rateCents: serviceRateCents,
            sessionMinutes,
            city: mode === 'in_person' ? city : undefined,
            inPersonArea: mode === 'in_person' ? inPersonArea : undefined,
            onlinePlatform: mode === 'online' ? onlinePlatform : undefined,
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; details?: unknown }
        | { teacher?: TeacherProfileResponse['teacher'] };
      if (!response.ok) {
        throw new Error((data && 'error' in data && data.error) || 'Failed to save profile');
      }

      setMessage('Teacher profile saved. Add registration payment to activate listing.');
      await loadProfile();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setBusy(false);
    }
  }

  async function payRegistrationFee() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/marketplace/teachers/registration-fee/checkout', { method: 'POST' });
      const data = (await response.json().catch(() => null)) as { error?: string; message?: string; alreadyPaid?: boolean };
      if (!response.ok) throw new Error(data?.error ?? 'Payment failed');
      setMessage(data?.alreadyPaid ? 'Registration fee is already paid.' : data?.message ?? 'Registration fee paid.');
      await loadProfile();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setBusy(false);
    }
  }

  const isPaid = Boolean(profile?.registrationFeePaidAt);
  const isActive = Boolean(profile?.isActive && profile.verificationStatus === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Teach On Marketplace</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Create services and activate your listing</p>
            </div>
          </div>
          <Link href="/marketplace/bookings" className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
            View Bookings
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5" />
            Teacher Status
          </h2>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
          ) : profile ? (
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                <p className="text-gray-500 dark:text-gray-400">Verification</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{profile.verificationStatus}</p>
              </div>
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                <p className="text-gray-500 dark:text-gray-400">Registration Fee</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{isPaid ? 'Paid' : 'Not paid'}</p>
              </div>
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                <p className="text-gray-500 dark:text-gray-400">Listing</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No teacher profile yet. Fill the form below to create one.</p>
          )}
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create or Update Teacher Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Headline
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                placeholder="Exam-focused Mathematics Teacher"
              />
            </label>

            <label className="text-sm text-gray-700 dark:text-gray-200">
              Hourly Rate (cents)
              <input
                type="number"
                value={hourlyRateCents}
                onChange={(e) => setHourlyRateCents(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
              />
            </label>
          </div>

          <label className="text-sm text-gray-700 dark:text-gray-200 block">
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
              placeholder="Describe your teaching approach and experience."
            />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Service Mode
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as ServiceMode)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
              >
                <option value="online">Online</option>
                <option value="in_person">Face-to-Face</option>
              </select>
            </label>

            <label className="text-sm text-gray-700 dark:text-gray-200">
              Service Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
              />
            </label>
          </div>

          <label className="text-sm text-gray-700 dark:text-gray-200 block">
            Service Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
            />
          </label>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Subject Slug
              <input
                type="text"
                value={subjectSlug}
                onChange={(e) => setSubjectSlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                placeholder="mathematics"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Session Price (cents)
              <input
                type="number"
                value={serviceRateCents}
                onChange={(e) => setServiceRateCents(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
              />
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Session Minutes
              <input
                type="number"
                value={sessionMinutes}
                onChange={(e) => setSessionMinutes(Number(e.target.value) || 60)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
              />
            </label>
          </div>

          {mode === 'online' ? (
            <label className="text-sm text-gray-700 dark:text-gray-200 block">
              Online Platform
              <input
                type="text"
                value={onlinePlatform}
                onChange={(e) => setOnlinePlatform(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                placeholder="Google Meet / Zoom"
              />
            </label>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <label className="text-sm text-gray-700 dark:text-gray-200">
                City
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                />
              </label>
              <label className="text-sm text-gray-700 dark:text-gray-200">
                Area
                <input
                  type="text"
                  value={inPersonArea}
                  onChange={(e) => setInPersonArea(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={busy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {busy ? 'Saving...' : 'Save Teacher Profile + Service'}
            </button>
            <button
              onClick={payRegistrationFee}
              disabled={busy}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pay Registration Fee ({toCurrency(49_900)})
            </button>
          </div>

          {message && <p className="text-sm text-blue-600 flex items-center gap-2"><CircleCheck className="w-4 h-4" />{message}</p>}
        </section>

        {profile?.services?.length ? (
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Active Services</h2>
            <div className="grid gap-3">
              {profile.services.map((service) => (
                <div key={service.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{service.title}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {service.mode === 'online' ? 'Online' : 'Face-to-Face'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {toCurrency(service.rateCents)} · {service.sessionMinutes} min
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

