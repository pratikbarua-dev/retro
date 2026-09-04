'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle, XCircle, Users, Edit3, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TimeSlot } from '@/types';

export default function AdminTimeSlotsPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newStart, setNewStart] = useState<string>('08:00 AM');
  const [newEnd, setNewEnd] = useState<string>('10:00 AM');
  const [newCapacity, setNewCapacity] = useState<number>(10);

  const fetchSlots = () => {
    setLoading(true);
    fetch('/api/admin/slots')
      .then((res) => res.json())
      .then((data) => {
        if (data.slots) setSlots(data.slots);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startTime: newStart,
        endTime: newEnd,
        capacity: newCapacity,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchSlots();
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const res = await fetch('/api/admin/slots', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !currentActive }),
    });

    if (res.ok) {
      fetchSlots();
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;
    const res = await fetch(`/api/admin/slots?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchSlots();
    }
  };

  const TIME_OPTIONS = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: TIME SLOTS CONTROL ::</Badge>
            <span className="text-xs font-mono text-slate-400">ACTIVE SLOTS: {slots.filter(s => s.isActive).length}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            TIME SLOTS & CAPACITY MANAGER
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure daily operating time slots, bench seat capacities, and availability toggles.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-mono font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Slot
        </button>
      </div>

      {/* TIME SLOTS TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400">Loading time slots...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900/60">
                <tr>
                  <th className="py-3.5 px-4">Slot Time Range</th>
                  <th className="py-3.5 px-4">Standard Duration</th>
                  <th className="py-3.5 px-4">Bench Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0066FF]" />
                      {slot.startTime} – {slot.endTime}
                    </td>
                    <td className="py-4 px-4 text-slate-400">2 Hours Standard</td>
                    <td className="py-4 px-4 font-bold text-blue-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {slot.capacity} Benches / Slot
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={slot.isActive ? 'green' : 'red'}>
                        {slot.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(slot.id, slot.isActive)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-colors ${
                            slot.isActive
                              ? 'bg-amber-950 border-amber-800 text-amber-300 hover:bg-amber-900'
                              : 'bg-emerald-950 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                          }`}
                        >
                          {slot.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
                          title="Delete Slot"
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

      {/* CREATE SLOT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0066FF]" />
                CREATE TIME SLOT
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">START TIME</label>
                <select
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`start_${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">END TIME</label>
                <select
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`end_${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">BENCH CAPACITY (MAX SEATS)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>


              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0066FF] text-white rounded-xl font-bold hover:bg-blue-600"
                >
                  Save Time Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
