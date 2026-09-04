'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  React.useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || data.user?.role !== 'ADMIN') {
          router.push('/login');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
    { name: 'Time Slots', href: '/admin/time-slots', icon: Clock },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Pricing & Packs', href: '/admin/pricing', icon: DollarSign },
    { name: 'Revenue', href: '/admin/revenue', icon: TrendingUp },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center p-1.5 animate-pulse">
            <Image src="/logo.png" alt="Retro Lab Logo" width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <p className="text-xs text-slate-400">Verifying Admin Access Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans selection:bg-[#0066FF] selection:text-white">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-5 justify-between shrink-0">
        <div className="space-y-6">
          {/* LOGO */}
          <Link href="/" className="block py-1">
            <Image src="/logo.png" alt="Retro Lab" width={140} height={40} className="h-10 w-auto object-contain" />
            <div className="text-[10px] font-mono text-blue-400 mt-1">ADMIN CONTROL</div>
          </Link>



          {/* NAV LINKS */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ADMIN PROFILE & LOGOUT */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
              AD
            </div>
            <div className="leading-tight overflow-hidden">
              <div className="text-xs font-bold text-white font-mono truncate">Lab Administrator</div>
              <div className="text-[10px] text-slate-400 truncate">admin@retrolab.com</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE TOP HEADER & DRAWER */}
      <div className="lg:hidden flex-1 flex flex-col min-h-screen">
        <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Retro Lab" width={110} height={32} className="h-8 w-auto object-contain" />
            <span className="font-extrabold text-xs font-mono text-blue-400">ADMIN</span>
          </Link>



          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded text-slate-400 hover:text-white"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {mobileDrawerOpen && (
          <div className="bg-slate-950 border-b border-slate-800 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-xs ${
                    pathname === item.href ? 'bg-[#0066FF] text-white' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-xs font-mono text-red-400"
            >
              Sign Out
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-900 text-slate-100 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* DESKTOP MAIN CONTENT */}
      <div className="hidden lg:flex flex-1 flex-col overflow-y-auto bg-slate-900 text-slate-100 p-8">
        {children}
      </div>
    </div>
  );
}
