import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, ArrowLeft, Wrench, Search, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: '404 - Circuit Not Found | Retro Lab',
  description: 'The page or circuit diagram you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative overflow-hidden bg-blueprint-dark">
        {/* GLOWING ORB */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full text-center space-y-8 relative z-10 font-mono">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800/80 rounded-full text-red-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            :: ERR_CODE: 0x404_CIRCUIT_DISCONNECTED ::
          </div>

          {/* LARGE 404 NUMBER */}
          <div className="space-y-2">
            <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-blue-500 tracking-tight font-mono">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
              PIN UNCONNECTED / PAGE NOT FOUND
            </h2>
          </div>

          {/* DIAGNOSTIC DOSSIER BOX */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left space-y-3 text-xs shadow-2xl backdrop-blur-xs">
            <div className="text-slate-400 font-bold border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>SYSTEM DIAGNOSTIC LOG</span>
              <span className="text-red-400">STATE: FAULT</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p><span className="text-slate-500">REQUEST_URI:</span> [Target resource unavailable]</p>
              <p><span className="text-slate-500">DIAGNOSIS:</span> The page may have been moved, renamed, or deleted.</p>
              <p><span className="text-slate-500">SUGGESTION:</span> Verify the address or return to the main workspace.</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full justify-center gap-2">
                <Home className="w-4 h-4" />
                Return to Workspace Home
              </Button>
            </Link>

            <Link href="/book" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full justify-center gap-2 border-slate-700 text-slate-300 hover:text-white">
                <Wrench className="w-4 h-4" />
                Book Bench Slot
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
