'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { CalendarClock, ChevronLeft, Coins, Monitor, Navigation, UserRound } from 'lucide-react';

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

type TeacherCard = {
  userId: string;
  headline?: string | null;
  bio?: string | null;
  hourlyRateCents: number;
  currency: string;
  user: { displayName?: string | null };
  services: TeacherService[];
  _count?: { teacherBookings?: number; reviewsReceived?: number };
};

type TeachersResponse = { teachers: TeacherCard[] };

const COMMISSION_BPS = 1500;

function toCurrency(cents: number, currency = 'ZAR'): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(cents / 100);
}

function calcPlatformFeeCents(rateCents: number): number {
  return Math.round((rateCents * COMMISSION_BPS) / 10000);
}

function calcTotalCents(rateCents: number): number {
  return rateCents + calcPlatformFeeCents(rateCents);
}

function localDateTimeInputValue(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function MarketplacePage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [teachers, setTeachers] = useState<TeacherCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<'all' | ServiceMode>('all');
  const [selectedService, setSelectedService] = useState<TeacherService | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherCard | null>(null);
  const [startsAt, setStartsAt] = useState(localDateTimeInputValue());
  const [timezone, setTimezone] = useState('Africa/Johannesburg');
  const [meetingLink, setMeetingLink] = useState('');
  const [inPersonVenue, setInPersonVenue] = useState('');
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingBusy, setBookingBusy] = useState(false);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) setTimezone(tz);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const qs = modeFilter === 'all' ? '' : `?mode=${modeFilter}`;
        const response = await fetch(`/api/marketplace/teachers${qs}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to load teachers');
        const data = (await response.json()) as TeachersResponse;
        setTeachers(data.teachers ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load teachers');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [modeFilter]);

  const servicesCount = useMemo(
    () => teachers.reduce((acc, teacher) => acc + (teacher.services?.length ?? 0), 0),
    [teachers]
  );

  async function handleBookAndPay() {
    if (!selectedService || !selectedTeacher) return;

    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=/marketplace');
      return;
    }

    setBookingMessage(null);
    setBookingBusy(true);

    try {
      const createResponse = await fetch('/api/marketplace/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startsAt: new Date(startsAt).toISOString(),
          timezone,
          meetingLink: selectedService.mode === 'online' ? meetingLink || undefined : undefined,
          inPersonVenue: selectedService.mode === 'in_person' ? inPersonVenue || undefined : undefined,
        }),
      });

      const createData = (await createResponse.json().catch(() => null)) as
        | { booking?: { id: string } }
        | { error?: string };

      if (!createResponse.ok || !createData || !('booking' in createData) || !createData.booking?.id) {
        const message = createData && 'error' in createData ? createData.error : 'Failed to create booking';
        throw new Error(message ?? 'Failed to create booking');
      }

      const payResponse = await fetch(`/api/marketplace/bookings/${createData.booking.id}/pay`, { method: 'POST' });
      const payData = (await payResponse.json().catch(() => null)) as { error?: string };
      if (!payResponse.ok) {
        throw new Error(payData?.error ?? 'Booking created but payment failed');
      }

      setBookingMessage('Booking confirmed and payment captured.');
      setSelectedService(null);
      setSelectedTeacher(null);
      setMeetingLink('');
      setInPersonVenue('');
      setStartsAt(localDateTimeInputValue());
    } catch (err) {
      setBookingMessage(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBookingBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Teacher Marketplace</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Book online or face-to-face sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/marketplace/bookings"
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
            >
              My Bookings
            </Link>
            <Link href="/marketplace/teach" className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white">
              Teach Here
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span>{teachers.length} teachers</span>
              <span>{servicesCount} services</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm ${modeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setModeFilter('online')}
                className={`px-3 py-1.5 rounded-lg text-sm ${modeFilter === 'online' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Online
              </button>
              <button
                onClick={() => setModeFilter('in_person')}
                className={`px-3 py-1.5 rounded-lg text-sm ${modeFilter === 'in_person' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Face-to-Face
              </button>
            </div>
          </div>
        </section>

        {loading && <p className="text-gray-600 dark:text-gray-300">Loading teachers...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && teachers.length === 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <p className="text-gray-600 dark:text-gray-300">No active teachers found for this filter yet.</p>
          </div>
        )}

        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <article key={teacher.userId} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <UserRound className="w-4 h-4" />
                    {teacher.user.displayName ?? 'Teacher'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{teacher.headline ?? 'Independent teacher'}</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  From {toCurrency(teacher.hourlyRateCents, teacher.currency)}
                </div>
              </div>

              {teacher.bio && <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{teacher.bio}</p>}

              <div className="grid md:grid-cols-2 gap-3">
                {teacher.services.map((service) => {
                  const platformFee = calcPlatformFeeCents(service.rateCents);
                  const total = calcTotalCents(service.rateCents);
                  return (
                    <div key={service.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{service.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {service.mode === 'online' ? 'Online' : 'Face-to-Face'}
                        </span>
                      </div>
                      {service.description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{service.description}</p>}
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <p className="flex items-center gap-2">
                          <CalendarClock className="w-4 h-4" />
                          {service.sessionMinutes} minutes
                        </p>
                        <p className="flex items-center gap-2">
                          <Coins className="w-4 h-4" />
                          {toCurrency(service.rateCents)} + fee {toCurrency(platformFee)} = {toCurrency(total)}
                        </p>
                        {service.mode === 'online' ? (
                          <p className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            {service.onlinePlatform ?? 'Online platform'}
                          </p>
                        ) : (
                          <p className="flex items-center gap-2">
                            <Navigation className="w-4 h-4" />
                            {service.city ?? 'City not set'} {service.inPersonArea ? `(${service.inPersonArea})` : ''}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setSelectedService(service);
                          setBookingMessage(null);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-sm font-medium"
                      >
                        Book This Session
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {selectedService && selectedTeacher && (
          <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Complete Booking</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedTeacher.user.displayName ?? 'Teacher'} · {selectedService.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedService(null);
                  setSelectedTeacher(null);
                }}
                className="text-sm text-gray-600 dark:text-gray-300"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <label className="text-sm text-gray-700 dark:text-gray-200">
                Start Date & Time
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </label>

              <label className="text-sm text-gray-700 dark:text-gray-200">
                Timezone
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </label>

              {selectedService.mode === 'online' ? (
                <label className="text-sm text-gray-700 dark:text-gray-200 md:col-span-2">
                  Preferred Meeting Link (optional)
                  <input
                    type="url"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                  />
                </label>
              ) : (
                <label className="text-sm text-gray-700 dark:text-gray-200 md:col-span-2">
                  Meeting Venue (required for in-person)
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2"
                    value={inPersonVenue}
                    onChange={(e) => setInPersonVenue(e.target.value)}
                    placeholder="Public library, school campus, etc."
                  />
                </label>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Total charge: <strong>{toCurrency(calcTotalCents(selectedService.rateCents))}</strong>
              </p>
              <button
                onClick={handleBookAndPay}
                disabled={bookingBusy}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                {bookingBusy ? 'Processing...' : 'Book & Pay'}
              </button>
            </div>

            {bookingMessage && <p className="mt-3 text-sm text-blue-600">{bookingMessage}</p>}
          </section>
        )}
      </main>
    </div>
  );
}

