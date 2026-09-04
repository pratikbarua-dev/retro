'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LabSettings } from '@/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<LabSettings>({
    labName: 'Retro Lab',
    institutionTag: 'Daffodil International University - Smart City',
    operatingHours: '08:00 AM – 10:00 PM',
    maxCapacityPerSlot: 10,
    advanceBookingDays: 30,
    maintenanceMode: false,
    systemStatus: 'OPERATIONAL',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSettings = () => {
    setLoading(true);
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    if (res.ok) {
      setMessage('Lab system settings updated successfully!');
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('CAUTION: Are you sure you want to reset the mock database back to initial seed data? All custom bookings and added time slots will be restored to defaults.')) {
      return;
    }

    setResetting(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });

    setResetting(false);
    if (res.ok) {
      alert('Mock database reset to original seed state!');
      fetchSettings();
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: SYSTEM CONFIGURATION ::</Badge>
            <span className="text-xs font-mono text-slate-400">LAB CORE PARAMETERS</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            LAB SETTINGS & CONTROL
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Global operational parameters, bench seat quotas, and database reset controls.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          {message}
        </div>
      )}

      {/* SETTINGS FORM */}
      <form onSubmit={handleSaveSettings} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#0066FF]" />
            GENERAL WORKSPACE METADATA
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">LAB BRAND NAME</label>
              <input
                type="text"
                value={settings.labName}
                onChange={(e) => setSettings({ ...settings, labName: e.target.value })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">INSTITUTION AFFILIATION</label>
              <input
                type="text"
                value={settings.institutionTag}
                onChange={(e) => setSettings({ ...settings, institutionTag: e.target.value })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#0066FF]" />
            BOOKING QUOTAS & OPERATING HOURS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">DEFAULT CAPACITY PER SLOT (SEATS)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxCapacityPerSlot}
                onChange={(e) => setSettings({ ...settings, maxCapacityPerSlot: parseInt(e.target.value, 10) })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">DAILY OPERATING HOURS</label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#0066FF] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Lab Configuration'}
          </button>
        </div>
      </form>

      {/* DANGER ZONE RESET */}
      <div className="bg-red-950/20 border border-red-900/60 p-6 rounded-2xl space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          DANGER ZONE: DEMO DATABASE RESET
        </div>
        <p className="text-slate-400">
          Resetting the mock database restores all initial seed users, bench packages, standard time slots, and bookings.
        </p>
        <button
          type="button"
          onClick={handleResetDatabase}
          disabled={resetting}
          className="px-4 py-2.5 bg-red-950 border border-red-800 text-red-300 hover:bg-red-900 rounded-xl font-bold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          {resetting ? 'Resetting Database...' : 'Reset Database to Seed State'}
        </button>
      </div>
    </div>
  );
}
