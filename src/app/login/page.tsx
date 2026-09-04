'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Cpu,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Terminal,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  SchematicMarginDecorations,
  FullPageSchematicOverlay,
  ChipDIP16,
  ChipQFP,
  WaveformIcon,
} from '@/components/ui/ElectronicsDecorations';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawRedirect = searchParams.get('redirect') || '/dashboard';
  const errorParam = searchParams.get('error');

  // Active Tab: 'credentials' | 'quick' | 'google'
  const [activeTab, setActiveTab] = useState<'credentials' | 'quick' | 'google'>('credentials');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'USER' | 'ADMIN'>('USER');

  // Loading & Feedback
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Parse error parameters on initial load
  useEffect(() => {
    if (errorParam === 'admin_required') {
      setStatusMessage({
        type: 'error',
        text: 'Access Denied: Administrator privileges required for that section.',
      });
    } else if (errorParam === 'unauthorized_role') {
      setStatusMessage({
        type: 'error',
        text: 'Insufficient Permissions: You were redirected to user access level.',
      });
    } else if (errorParam === 'session_expired') {
      setStatusMessage({
        type: 'error',
        text: 'Session Expired: Please log in again to continue.',
      });
    }
  }, [errorParam]);

  // Execute actual redirect safely according to role
  const executeSmartRedirect = (userRole: 'USER' | 'ADMIN') => {
    let target = rawRedirect;

    if (userRole === 'ADMIN') {
      if (!target.startsWith('/admin')) {
        target = '/admin';
      }
    } else {
      if (target.startsWith('/admin')) {
        target = '/dashboard';
      }
    }

    router.push(target);
    router.refresh();
  };

  const handleLoginSubmit = async (emailToLogin: string, roleToLogin: 'USER' | 'ADMIN') => {
    if (!emailToLogin) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToLogin, role: roleToLogin }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `Authenticated successfully as ${data.user.name}!` });
        setTimeout(() => {
          executeSmartRedirect(data.user.role || roleToLogin);
        }, 400);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Authentication failed. Check credentials.' });
        setLoading(false);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network connection error. Try again.' });
      setLoading(false);
    }
  };

  const handleGoogleOAuthInitiate = (role: 'USER' | 'ADMIN') => {
    setLoading(true);
    setStatusMessage({ type: 'success', text: 'Connecting to Google OAuth Gateway...' });
    const authUrl = `/api/auth/google?redirect=${encodeURIComponent(rawRedirect)}&role=${role}`;
    setTimeout(() => {
      window.location.href = authUrl;
    }, 300);
  };

  return (
    <div className="min-h-screen bg-blueprint-dense relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-[#0066FF] selection:text-white">
      {/* BACKGROUND SCHEMATIC GRAPHICS & ANIMATION */}
      <SchematicMarginDecorations />
      <FullPageSchematicOverlay />

      {/* TOP NAVIGATION LINK BACK */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 text-xs font-mono font-semibold text-slate-700 hover:text-[#0066FF] hover:border-blue-300 shadow-sm transition-all group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#0066FF]" />
          Return to Portal
        </Link>
      </div>

      {/* MAIN CONTAINER AUTH CARD */}
      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-slate-300/80 shadow-2xl p-6 sm:p-8 space-y-6 tech-corner-box animate-tech-pulse relative overflow-hidden">
          {/* DECORATIVE BACKGROUND CHIP ICON */}
          <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
            <ChipQFP className="w-48 h-48 text-[#0066FF]" />
          </div>

          {/* GATEWAY STATUS BAR */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-signal-blink shadow-[0_0_8px_#10B981]" />
              <span className="text-[11px] font-mono font-bold text-slate-600 tracking-wider">
                GATEWAY STATUS :: ONLINE
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-[10px] font-mono font-bold text-[#0066FF]">
              <Lock className="w-3 h-3" /> TLS 1.3 SECURE
            </div>
          </div>

          {/* BRAND HEADLINE */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img src="/logo.png" alt="Retro Lab" className="h-16 w-auto object-contain" />
            </div>


            <p className="text-xs font-mono text-slate-500">
              :: MULTI-ROLE HARDWARE WORKSPACE AUTHENTICATION ::
            </p>
          </div>

          {/* ERROR OR SUCCESS FEEDBACK BANNER */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-3 transition-all ${
                statusMessage.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              )}
              <span className="leading-snug">{statusMessage.text}</span>
            </div>
          )}

          {/* AUTHENTICATION TAB SELECTOR */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl font-mono text-xs border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('credentials');
                setStatusMessage(null);
              }}
              className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'credentials'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Sign In
            </button>

            <button
              onClick={() => {
                setActiveTab('quick');
                setStatusMessage(null);
              }}
              className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'quick'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-[#0066FF] text-[#0066FF]" />
              Quick Demo
            </button>

            <button
              onClick={() => {
                setActiveTab('google');
                setStatusMessage(null);
              }}
              className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'google'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Google SSO
            </button>
          </div>

          {/* ==================================================
              TAB 1: CREDENTIALS SIGN IN
          ================================================== */}
          {activeTab === 'credentials' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLoginSubmit(email || 'pratik@diu.edu.bd', selectedRole);
              }}
              className="space-y-4 pt-1"
            >
              {/* ROLE SELECTION BADGES */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                  Select Access Role:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('USER')}
                    className={`p-3 rounded-xl border-2 text-left font-mono transition-all cursor-pointer flex items-center gap-3 ${
                      selectedRole === 'USER'
                        ? 'border-[#0066FF] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === 'USER' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-slate-300'
                      }`}
                    >
                      {selectedRole === 'USER' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Lab Member</div>
                      <div className="text-[10px] text-slate-500">Normal User</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ADMIN')}
                    className={`p-3 rounded-xl border-2 text-left font-mono transition-all cursor-pointer flex items-center gap-3 ${
                      selectedRole === 'ADMIN'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === 'ADMIN' ? 'border-blue-400 bg-blue-400' : 'border-slate-300'
                      }`}
                    >
                      {selectedRole === 'ADMIN' && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-extrabold ${selectedRole === 'ADMIN' ? 'text-white' : 'text-slate-900'}`}
                      >
                        Administrator
                      </div>
                      <div className={selectedRole === 'ADMIN' ? 'text-[10px] text-slate-400' : 'text-[10px] text-slate-500'}>
                        Full Admin Access
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* EMAIL INPUT */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={selectedRole === 'ADMIN' ? 'admin@retrolab.com' : 'user@diu.edu.bd'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-sans focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Password <span className="text-slate-400 font-normal">(Optional for demo)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm font-sans focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full justify-center text-sm font-bold shadow-md hover:shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2 font-mono">
                    <Cpu className="w-4 h-4 animate-spin" /> Verifying Credentials...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 font-mono">
                    Authorize Gateway Access <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* ==================================================
              TAB 2: QUICK ACCELERATOR DEMO ACCOUNTS
          ================================================== */}
          {activeTab === 'quick' && (
            <div className="space-y-4 pt-1">
              <div className="text-xs font-mono text-slate-500">
                Click any profile card below for instant authorization:
              </div>

              <div className="space-y-3">
                {/* PRATIK - LAB MEMBER CARD */}
                <button
                  onClick={() => handleLoginSubmit('pratik@diu.edu.bd', 'USER')}
                  disabled={loading}
                  className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50/40 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-[#0066FF] rounded-2xl text-left transition-all cursor-pointer group flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                      alt="Pratik Barua"
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#0066FF]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition-colors">
                          Pratik Barua
                        </span>
                        <Badge variant="blue">USER</Badge>
                      </div>
                      <p className="text-xs font-mono text-slate-500">pratik@diu.edu.bd</p>
                      <p className="text-[10px] font-mono text-slate-400">Daffodil Int. University • SWE 45th</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white text-[#0066FF] border border-blue-200 flex items-center justify-center group-hover:bg-[#0066FF] group-hover:text-white transition-all shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* ADMIN PANEL CARD */}
                <button
                  onClick={() => handleLoginSubmit('admin@retrolab.com', 'ADMIN')}
                  disabled={loading}
                  className="w-full p-4 bg-slate-950 hover:bg-slate-900 border-2 border-slate-800 hover:border-blue-500 text-white rounded-2xl text-left transition-all cursor-pointer group flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-950 border-2 border-blue-500 text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                      AD
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                          Lab System Admin
                        </span>
                        <Badge variant="navy">ADMIN</Badge>
                      </div>
                      <p className="text-xs font-mono text-slate-400">admin@retrolab.com</p>
                      <p className="text-[10px] font-mono text-blue-400">Full Infrastructure Control</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-blue-400 border border-slate-700 flex items-center justify-center group-hover:bg-[#0066FF] group-hover:text-white transition-all shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              TAB 3: GOOGLE OAUTH SSO
          ================================================== */}
          {activeTab === 'google' && (
            <div className="space-y-4 pt-1">
              <div className="text-xs font-mono text-slate-500">
                Authenticate using your Google Workspace / DIU Institution account:
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleGoogleOAuthInitiate('USER')}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-slate-300 hover:border-[#0066FF] bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-[#0066FF] transition-colors">
                    Sign in with Google OAuth (User)
                  </span>
                </button>

                <button
                  onClick={() => handleGoogleOAuthInitiate('ADMIN')}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-slate-800 hover:border-[#0066FF] bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer group"
                >
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="font-mono text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Google OAuth (Admin Mode)
                  </span>
                </button>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] font-mono text-blue-700 flex items-center gap-2">
                <Zap className="w-4 h-4 shrink-0 text-[#0066FF]" />
                <span>Google OAuth auto-detects institutional credentials and grants verified access.</span>
              </div>
            </div>
          )}

          {/* BOTTOM FOOTER UTILITIES */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="text-[10px] text-slate-400">RETRO LAB v2.5 :: DIU</span>
            <Link href="/contact" className="hover:text-[#0066FF] transition-colors">
              Request Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-blueprint flex items-center justify-center font-mono text-xs text-slate-500">
          Loading Auth Gateway...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
