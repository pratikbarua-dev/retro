'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Edit3, Sliders, CheckCircle, Package as PkgIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Package, CustomPricingRule } from '@/types';

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [customRules, setCustomRules] = useState<CustomPricingRule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const fetchPricing = () => {
    setLoading(true);
    fetch('/api/admin/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.packages) setPackages(data.packages);
        if (data.customPricing) setCustomRules(data.customPricing);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleSavePackagePrice = async (pkgId: string) => {
    const res = await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'package',
        packageId: pkgId,
        updates: { price: editPrice },
      }),
    });

    if (res.ok) {
      setEditingPackageId(null);
      fetchPricing();
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: PRICING CONTROL SYSTEM ::</Badge>
            <span className="text-xs font-mono text-slate-400">ACTIVE PACKAGES: {packages.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            PRICING MATRIX & BENCH PACKAGES
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure hourly rates, standard group packages, and dynamic member duration formulas.
          </p>
        </div>
      </div>

      {/* STANDARD PACKAGES CARDS GRID */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
          <PkgIcon className="w-5 h-5 text-[#0066FF]" />
          STANDARD BENCH PACKAGES
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">Loading package rates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 uppercase font-bold">{pkg.id}</span>
                    <Badge variant={pkg.isCustom ? 'amber' : 'blue'}>
                      {pkg.isCustom ? 'DYNAMIC CALCULATOR' : `${pkg.minMembers} Persons`}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white mt-1">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">{pkg.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">SESSION PRICE</div>
                    {editingPackageId === pkg.id ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-emerald-400 text-sm">৳</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseInt(e.target.value, 10))}
                          className="w-24 p-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white"
                        />
                      </div>
                    ) : (
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {pkg.isCustom ? 'Calculated' : `৳${pkg.price}`}
                      </div>
                    )}
                  </div>

                  <div>
                    {!pkg.isCustom && (
                      editingPackageId === pkg.id ? (
                        <button
                          onClick={() => handleSavePackagePrice(pkg.id)}
                          className="px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-1 font-bold"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPackageId(pkg.id);
                            setEditPrice(pkg.price);
                          }}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DYNAMIC PRICING MATRIX TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0066FF]" />
            CUSTOM PACK MATRIX SAMPLE (MEMBERS × DURATION)
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dynamic formula calculates: ৳120 per member per 2-hour duration slot.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center font-mono text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900/60">
              <tr>
                <th className="py-3 px-4 text-left">Members</th>
                <th className="py-3 px-4">2 Hours</th>
                <th className="py-3 px-4">4 Hours</th>
                <th className="py-3 px-4">6 Hours</th>
                <th className="py-3 px-4">8 Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {[1, 2, 4, 6, 8, 10].map((m) => (
                <tr key={m} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 text-left font-bold text-white">{m} Persons</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">৳{m * 1 * 120}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">৳{m * 2 * 120}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">৳{m * 3 * 120}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">৳{m * 4 * 120}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
