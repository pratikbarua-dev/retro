'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Booking } from '@/types';

export default function AdminCalendarPage() {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-04');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setAllBookings(data.bookings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      fetchBookings();
    }
  };

  const bookingsForSelectedDate = allBookings.filter(
    (b) => b.bookingDate === selectedDate && b.status !== 'CANCELLED'
  );

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="blue">:: VISUAL SCHEDULER ::</Badge>
          <span className="text-xs font-mono text-slate-400">DAILY OCCUPANCY OVERLAY</span>
        </div>
        <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
          LAB CALENDAR & RESERVATIONS
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Interactive monthly view showing daily seat utilization and scheduled prototyping sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN CALENDAR GRID */}
        <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#0066FF]" />
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WEEKDAY HEADERS */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-slate-400 font-bold">
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-2 font-mono">
            {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, idx) => (
              <div key={`blank_${idx}`} className="h-20 bg-slate-900/20 rounded-xl" />
            ))}

            {Array.from(
              { length: new Date(currentYear, currentMonth + 1, 0).getDate() },
              (_, i) => {
                const dayNum = i + 1;
                const mm = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
                const dd = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const dateStr = `${currentYear}-${mm}-${dd}`;
                const isSelected = selectedDate === dateStr;

                const dayBookings = allBookings.filter(
                  (b) => b.bookingDate === dateStr && b.status !== 'CANCELLED'
                );
                const bookedSeats = dayBookings.reduce((sum, b) => sum + b.members, 0);

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-20 p-2 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/60 border-[#0066FF] ring-2 ring-blue-500/20'
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                        {dayNum}
                      </span>
                    </div>

                    <div>
                      {bookedSeats > 0 ? (
                        <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 truncate">
                          {bookedSeats} seats
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-600">Open</div>
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* SELECTED DATE BOOKINGS SIDEBAR */}
        <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-blue-400 uppercase">SELECTED DATE DOSSIER</span>
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2 mt-0.5">
                <Clock className="w-4 h-4 text-[#0066FF]" />
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="py-8 text-center text-xs font-mono text-slate-400">Loading bookings...</div>
              ) : bookingsForSelectedDate.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl p-4">
                  No active prototyping sessions booked for this date.
                </div>
              ) : (
                bookingsForSelectedDate.map((b) => (
                  <div key={b.id} className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{b.customerName}</span>
                      <Badge variant="green">{b.members} Seats</Badge>
                    </div>
                    <div className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {b.startTime} – {b.endTime}
                    </div>
                    <div className="text-[10px] text-slate-500">{b.packageName} | ৳{b.totalPrice}</div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                        className="px-2 py-1 bg-red-950 text-red-300 rounded text-[10px] font-mono border border-red-800 flex items-center gap-1 hover:bg-red-900"
                      >
                        <XCircle className="w-3 h-3 text-red-400" /> Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Total Sessions:</span>
            <span className="font-bold text-white">{bookingsForSelectedDate.length} Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
