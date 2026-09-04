'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { AnalyticsSummary, Booking } from '@/types';

export default function AdminRevenuePage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) setSummary(data.summary);
      });

    fetch('/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeBookings = bookings.filter((b) => b.status !== 'CANCELLED');

  const totalRevenue = activeBookings.reduce(
    (sum, b) => sum + b.totalPrice,
    0
  );

  const avgOrderValue = activeBookings.length > 0 ? Math.round(totalRevenue / activeBookings.length) : 0;

  // Dynamic Package Revenue Breakdown
  const packageStatsMap = activeBookings.reduce((acc, b) => {
    const pkgName = b.packageName || 'Custom Pack';
    if (!acc[pkgName]) {
      acc[pkgName] = { count: 0, revenue: 0 };
    }
    acc[pkgName].count += 1;
    acc[pkgName].revenue += b.totalPrice;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const packageBreakdown = Object.entries(packageStatsMap)
    .map(([name, stat]) => ({
      name,
      count: stat.count,
      revenue: stat.revenue,
      share: totalRevenue > 0 ? ((stat.revenue / totalRevenue) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: FINANCIAL REPORTING ::</Badge>
            <span className="text-xs font-mono text-slate-400">AUDITED FINANCIAL RECORD</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            REVENUE & FINANCIAL ANALYTICS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Financial performance summary, package yield analysis, and seat monetisation metrics.
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">GROSS REVENUE</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-4xl font-extrabold text-emerald-400">
            ৳{totalRevenue}
          </div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Active Confirmed Revenue
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">AVG ORDER VALUE</span>
            <BarChart3 className="w-5 h-5 text-[#0066FF]" />
          </div>
          <div className="text-4xl font-extrabold text-white">
            ৳{avgOrderValue}
          </div>
          <div className="text-xs text-slate-400">
            Per booking session average
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">POPULAR PACKAGE YIELD</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white truncate">
            {packageBreakdown[0]?.name || summary?.mostPopularPackage || 'CUSTOM PACK'}
          </div>
          <div className="text-xs text-amber-400">
            Highest revenue contributor
          </div>
        </div>
      </div>

      {/* DYNAMIC BREAKDOWN TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#0066FF]" />
            PACKAGE REVENUE CONTRIBUTION (DYNAMIC REAL-TIME)
          </h2>
          <span className="text-xs text-slate-400">Live Database Sync</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">Computing financial breakdown...</div>
        ) : packageBreakdown.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">No active confirmed bookings recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900/60">
                <tr>
                  <th className="py-3.5 px-4">Package Name</th>
                  <th className="py-3.5 px-4">Bookings Count</th>
                  <th className="py-3.5 px-4">Total Revenue Generated</th>
                  <th className="py-3.5 px-4 text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {packageBreakdown.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-900/40">
                    <td className="py-4 px-4 font-bold text-white">{row.name}</td>
                    <td className="py-4 px-4">{row.count} Sessions</td>
                    <td className="py-4 px-4 font-bold text-emerald-400">৳{row.revenue}</td>
                    <td className="py-4 px-4 text-right font-bold text-blue-400">{row.share}%</td>
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
