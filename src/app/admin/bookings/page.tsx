'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus,
  X,
  User,
  Phone,
  Building,
  Clock,
  DollarSign,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Booking } from '@/types';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Form State for Manual Walk-In Booking
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-09-05');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [members, setMembers] = useState(2);
  const [packageId, setPackageId] = useState('pack_pair');

  const fetchBookings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);

    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });

    if (res.ok) {
      fetchBookings();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    const res = await fetch(`/api/admin/bookings?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      if (selectedBooking?.id === id) setSelectedBooking(null);
      fetchBookings();
    }
  };

  const handleCreateWalkInBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_walkin',
        customerName,
        customerPhone,
        institution: 'Daffodil International University',
        department: 'Robotics Engineering',
        batch: 'Walk-In',
        bookingDate,
        startTime,
        endTime: '12:00 PM',
        duration: 2,
        members,
        packageId,
        packageName: packageId === 'pack_pair' ? 'Pair Pack (2 Persons)' : packageId === 'pack_team' ? 'Team Pack (4 Persons)' : 'Custom Bench Pack',
        purpose: 'Manual Walk-In Bench Slot',
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setCreateModalOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      fetchBookings();
    } else {
      alert(data.error || 'Failed to create booking');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: BOOKINGS ENGINE ::</Badge>
            <span className="text-xs font-mono text-slate-400">TOTAL RECORDS: {bookings.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            BOOKING RECORDS MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search, filter, confirm, or cancel customer lab reservations.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-mono font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Walk-In Booking
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer, code, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="inline-flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400">Loading bookings data...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400">
            No booking records match your current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900/60">
                <tr>
                  <th className="py-3.5 px-4">Booking Code</th>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Team</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-blue-400">{b.bookingCode}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                      <div className="text-[10px] text-slate-500">{b.institution}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{b.bookingDate}</div>
                      <div className="text-[10px] text-slate-400">{b.startTime} – {b.endTime}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-200">{b.members} Seats</td>
                    <td className="py-4 px-4 text-slate-400">{b.packageName}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400">৳{b.totalPrice}</td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {b.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition-colors text-[10px] font-mono flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            Confirm
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            className="p-1.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 transition-colors text-[10px] font-mono flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5 text-amber-400" />
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MANUAL WALK-IN BOOKING MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0066FF]" />
                ADD WALK-IN BOOKING
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkInBooking} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">CUSTOMER NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Samin Yasar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">PHONE NUMBER</label>
                <input
                  type="text"
                  placeholder="+880 1712-345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">BOOKING DATE</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">START TIME</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">MEMBERS (SEATS)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={members}
                    onChange={(e) => setMembers(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">PACKAGE</label>
                  <select
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="pack_pair">Pair Pack (2 Persons)</option>
                    <option value="pack_team">Team Pack (4 Persons)</option>
                    <option value="pack_custom">Custom Bench Pack</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0066FF] text-white rounded-xl font-bold hover:bg-blue-600"
                >
                  Confirm Walk-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">RESERVATION DOSSIER</span>
                <h3 className="text-xl font-bold font-mono text-white">{selectedBooking.bookingCode}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-blue-400" /> Customer Name</div>
                  <div className="font-bold text-white text-sm">{selectedBooking.customerName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> Phone Number</div>
                  <div className="font-bold text-white">{selectedBooking.customerPhone}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-400" /> Institution</div>
                  <div className="font-semibold text-slate-200">{selectedBooking.institution}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-blue-400" /> Dept / Batch</div>
                  <div className="font-semibold text-slate-200">{selectedBooking.department}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> Session Schedule & Purpose</div>
                <div className="font-bold text-white">{selectedBooking.bookingDate} | {selectedBooking.startTime} – {selectedBooking.endTime} ({selectedBooking.duration} hrs)</div>
                <div className="text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-1">"{selectedBooking.purpose || 'General Lab Work'}"</div>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="text-slate-400 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total Fee</div>
                  <div className="text-lg font-bold text-emerald-400">৳{selectedBooking.totalPrice} ({selectedBooking.members} Seats)</div>
                </div>
                <div>
                  <Badge variant={selectedBooking.status === 'CONFIRMED' ? 'green' : selectedBooking.status === 'PENDING' ? 'amber' : 'red'}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
