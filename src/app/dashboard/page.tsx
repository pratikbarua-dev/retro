'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Users,
  Cpu,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  LogOut,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Booking, User } from '@/types';

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch session
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !data.user) {
          router.push('/login?redirect=/dashboard');
          return;
        }
        setUser(data.user);
      });

    // Fetch user bookings
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) {
          setBookings(data.bookings);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* USER PROFILE HEADER */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                }
                alt={user?.name || 'User'}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#0066FF]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 font-mono">
                    {user?.name || 'Maker Profile'}
                  </h1>
                  <Badge variant={user?.role === 'ADMIN' ? 'navy' : 'blue'}>
                    {user?.role || 'USER'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {user?.institution} • {user?.department} ({user?.batch})
                </p>
                <p className="text-xs text-[#0066FF] font-mono">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="secondary" size="md">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/book">
                <Button variant="primary" size="md">
                  <Plus className="w-4 h-4" />
                  Book New Slot
                </Button>
              </Link>
            </div>
          </div>

          {/* MY BOOKINGS SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="blue" className="mb-1">
                  :: MY RESERVATION HISTORY ::
                </Badge>
                <h2 className="text-2xl font-extrabold text-slate-900 font-mono">
                  MY WORKSPACE BOOKINGS
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Total Bookings: {bookings.length}
              </span>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-400 font-mono text-sm border border-slate-200">
                Loading your bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <Cpu className="w-12 h-12 text-[#0066FF] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-slate-900 font-mono">No bookings found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You haven't reserved any bench slot yet. Book a workspace bench to start prototyping!
                </p>
                <Link href="/book">
                  <Button variant="primary" size="md">
                    Book Your First Bench Slot →
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((b) => {
                  const isConfirmed = b.status === 'CONFIRMED';
                  const isPending = b.status === 'PENDING';

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-[#0066FF]">
                            {b.bookingCode}
                          </span>
                          <div className="text-xs text-slate-400 font-mono">
                            Package: {b.packageName}
                          </div>
                        </div>
                        <Badge
                          variant={isConfirmed ? 'green' : isPending ? 'amber' : 'red'}
                        >
                          {b.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs font-mono text-slate-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#0066FF]" />
                          <span>Date: {b.bookingDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#0066FF]" />
                          <span>Time: {b.startTime} – {b.endTime} ({b.duration}h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#0066FF]" />
                          <span>Members: {b.members} Members</span>
                        </div>
                        <div className="pt-2 text-slate-500 italic">
                          "{b.purpose}"
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500">
                          Payment Status: <strong className="text-slate-800">{b.paymentStatus}</strong>
                        </span>
                        <span className="text-lg font-extrabold text-[#0066FF] font-mono">
                          ৳{b.totalPrice}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
