'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CircleCheckBig, CircleX, CreditCard, FileCheck2 } from 'lucide-react';

type Booking = {
  id: string;
  status: string;
  mode: 'online' | 'in_person';
  startsAt: string;
  endsAt: string;
  timezone: string;
  agreedRateCents: number;
  platformFeeCents: number;
  totalChargeCents: number;
  meetingLink?: string | null;
  inPersonVenue?: string | null;
  service: {
    title: string;
    mode: 'online' | 'in_person';
    sessionMinutes: number;
    subjectSlug?: string | null;
  };
  student: { id: string; displayName?: string | null };
  teacher: { user?: { displayName?: string | null } };
};

type BookingsResponse = { bookings: Booking[] };

function toCurrency(cents: number): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(cents / 100);
}

function prettyDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function MarketplaceBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadBookings(role: 'all' | 'student' | 'teacher' = roleFilter) {
    try {
      setLoading(true);
      const qs = role === 'all' ? '' : `?as=${role}`;
      const response = await fetch(`/api/marketplace/bookings${qs}`);
      if (!response.ok) throw new Error('Failed to load bookings');
      const data = (await response.json()) as BookingsResponse;
      setBookings(data.bookings ?? []);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runBookingAction(bookingId: string, action: 'pay' | 'cancel' | 'complete') {
    setBusyId(bookingId);
    setMessage(null);
    try {
      const response = await fetch(`/api/marketplace/bookings/${bookingId}/${action}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: action === 'cancel' ? JSON.stringify({ reason: 'Cancelled by user' }) : undefined,
      });
      const data = (await response.json().catch(() => null)) as { error?: string; refundCents?: number };
      if (!response.ok) throw new Error(data?.error ?? `Failed to ${action} booking`);
      if (action === 'cancel' && typeof data?.refundCents === 'number') {
        setMessage(`Booking cancelled. Refund: ${toCurrency(data.refundCents)}`);
      } else {
        setMessage(`Booking ${action} successful.`);
      }
      await loadBookings(roleFilter);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : `Failed to ${action} booking`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Marketplace Bookings</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage student and teacher sessions</p>
            </div>
          </div>
          <Link href="/marketplace/teach" className="text-sm px-3 py-2 rounded-lg bg-blue-600 text-white">
            Teacher Console
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setRoleFilter('all');
              void loadBookings('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${roleFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => {
              setRoleFilter('student');
              void loadBookings('student');
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${roleFilter === 'student' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            As Student
          </button>
          <button
            onClick={() => {
              setRoleFilter('teacher');
              void loadBookings('teacher');
            }}
            className={`px-3 py-1.5 rounded-lg text-sm ${roleFilter === 'teacher' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            As Teacher
          </button>
        </section>

        {message && <p className="text-sm text-blue-600">{message}</p>}
        {loading && <p className="text-gray-600 dark:text-gray-300">Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-gray-600 dark:text-gray-300">No bookings yet.</p>
          </div>
        )}

        <div className="grid gap-3">
          {bookings.map((booking) => (
            <article key={booking.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">{booking.service.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {prettyDate(booking.startsAt)} · {booking.timezone} · {booking.mode === 'online' ? 'Online' : 'Face-to-Face'}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {booking.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
                <p>Teacher: {booking.teacher.user?.displayName ?? 'Teacher'}</p>
                <p>Student: {booking.student.displayName ?? 'Student'}</p>
                <p>Session: {toCurrency(booking.agreedRateCents)}</p>
                <p>Platform Fee: {toCurrency(booking.platformFeeCents)}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">Total: {toCurrency(booking.totalChargeCents)}</p>
                {booking.mode === 'online' ? (
                  <p>Meeting Link: {booking.meetingLink ?? 'Not set'}</p>
                ) : (
                  <p>Venue: {booking.inPersonVenue ?? 'Not set'}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {booking.status === 'pending_payment' && (
                  <button
                    onClick={() => void runBookingAction(booking.id, 'pay')}
                    disabled={busyId === booking.id}
                    className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm flex items-center gap-2 disabled:opacity-60"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay
                  </button>
                )}
                {(booking.status === 'pending_payment' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => void runBookingAction(booking.id, 'cancel')}
                    disabled={busyId === booking.id}
                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm flex items-center gap-2 disabled:opacity-60"
                  >
                    <CircleX className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                {(booking.status === 'confirmed' || booking.status === 'in_session') && (
                  <button
                    onClick={() => void runBookingAction(booking.id, 'complete')}
                    disabled={busyId === booking.id}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2 disabled:opacity-60"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                {booking.status === 'completed' && (
                  <span className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm flex items-center gap-2">
                    <CircleCheckBig className="w-4 h-4" />
                    Completed
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

