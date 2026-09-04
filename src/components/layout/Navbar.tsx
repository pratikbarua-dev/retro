'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { User } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Check auth session
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Book a Slot', href: '/book' },
    { name: 'Free Consultation', href: '/consultation' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];


  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 bg-blueprint">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: RETRO LAB Logo Image */}
          <Link href="/" className="flex items-center group py-1">
            <Image
              src="/logo.png"
              alt="Retro Lab"
              width={160}
              height={48}
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="h-10 sm:h-12 object-contain transition-transform group-hover:scale-105"
            />
          </Link>




          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#0066FF] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: User Account / Login & Primary CTA */}
          <div className="hidden md:flex items-center gap-4">
            {!loadingUser && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0066FF] bg-white text-slate-800 transition-colors"
                >
                  <Image
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={user.name}
                    width={28}
                    height={28}
                    unoptimized
                    className="w-7 h-7 rounded-full object-cover border border-slate-300"
                  />

                  <div className="text-left leading-tight">
                    <div className="text-xs font-semibold text-slate-900 max-w-[100px] truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#0066FF]">
                      {user.role}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-2">
                      <p className="text-xs text-slate-500 font-mono">Signed in as</p>
                      <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]"
                        >
                          <Shield className="w-4 h-4 text-[#0066FF]" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#0066FF]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        My Bookings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <Link href="/book">
              <Button variant="primary" size="md" className="group">
                Book a Slot
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/book">
              <Button variant="primary" size="sm">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-blue-50 text-[#0066FF] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1.5 text-xs text-slate-500 font-mono">
                  User: {user.name} ({user.role})
                </div>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-[#0066FF] bg-blue-50 font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
