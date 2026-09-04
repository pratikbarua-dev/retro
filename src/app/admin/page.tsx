'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Calendar,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Booking, AnalyticsSummary } from '@/types';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = () => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setSummary(data.summary);
      });

    fetch('/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) {
          setTodayBookings(data.bookings.slice(0, 6));
        }
      });

    fetch('/api/admin/time-slots')
      .then((res) => res.json())
      .then((data) => {
        if (data.slots) setTimeSlots(data.slots);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: OVERVIEW CONTROL PANEL ::</Badge>
            <span className="text-xs font-mono text-slate-400">REALTIME SYNC ACTIVE</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time tracking for bookings, seat capacity, revenue, and active workspace rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/time-slots"
            className="px-3.5 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-mono font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Add Time Slot
          </Link>
        </div>
      </div>

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">TOTAL BOOKINGS</span>
            <CalendarCheck className="w-4 h-4 text-[#0066FF]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {summary?.totalBookings ?? 0}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Live Database Sync
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">REGISTERED USERS</span>
            <Users className="w-4 h-4 text-[#0066FF]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {summary?.totalUsers ?? 0}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Verified Members
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">REVENUE (BDT)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            ৳{summary?.totalRevenue ?? 0}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Gross Earnings
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">TODAY'S OCCUPANCY</span>
            <Activity className="w-4 h-4 text-[#0066FF]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {summary?.occupancyRate ?? 0}%
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {summary?.seatsBookedToday ?? 0} / {summary?.totalSeatsToday ?? 40} seats filled today
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: QUICK ACTIONS & POPULAR SLOTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0066FF]" />
              POPULAR TIME SLOTS OCCUPANCY
            </h2>
            <Link href="/admin/time-slots" className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {timeSlots.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/80">
              No active time slots configured yet. Create slots in Time Slots management.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {timeSlots.slice(0, 4).map((slot) => {
                const booked = slot.bookedSeats || 0;
                const cap = slot.capacity || 10;
                const percent = Math.round((booked / cap) * 100);
                return (
                  <div key={slot.id || slot.startTime} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{slot.startTime} – {slot.endTime}</div>
                      <div className="text-[10px] text-slate-400">{slot.label || `${booked}/${cap} Seats`}</div>
                    </div>
                    <Badge variant={percent > 80 ? 'red' : percent > 50 ? 'amber' : 'green'}>
                      {percent}% Full
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* QUICK NAVIGATION PANEL */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-[#0066FF]" />
              ADMIN CONTROL MODULES
            </h2>
            <div className="space-y-2 font-mono text-xs">
              <Link href="/admin/bookings" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors">
                <span className="flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-blue-400" /> Bookings List</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <Link href="/admin/calendar" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> Visual Calendar</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
              <Link href="/admin/users" className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-amber-400" /> Users & Roles</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>System Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S RECENT BOOKINGS TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#0066FF]" />
              RECENT BOOKINGS MANAGEMENT
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Live status toggling directly updates workspace seat availability.
            </p>
          </div>
          <Link href="/admin/bookings" className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
            View All Bookings ({summary?.totalBookings || 24}) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900/50">
                <tr>
                  <th className="py-3 px-4">Code / Customer</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Members</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {todayBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{b.customerName}</div>
                      <div className="text-[10px] text-blue-400">{b.bookingCode}</div>
                      <div className="text-[10px] text-slate-500">{b.institution}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div>{b.bookingDate}</div>
                      <div className="text-[10px] text-slate-400">{b.startTime} – {b.endTime}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-400">
                      {b.members} Persons
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{b.packageName}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ৳{b.totalPrice}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          b.status === 'CONFIRMED'
                            ? 'green'
                            : b.status === 'PENDING'
                            ? 'amber'
                            : 'red'
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition-colors text-[10px] font-mono flex items-center gap-1"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            Confirm
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-300 hover:bg-red-900 transition-colors text-[10px] font-mono flex items-center gap-1"
                            title="Cancel Booking & Restore Seats"
                          >
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
