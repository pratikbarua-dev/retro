import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 bg-blueprint-dark pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-white/95 rounded-xl p-2 border border-slate-700 shadow-md group-hover:border-[#0066FF] transition-all inline-block">
                <Image
                  src="/logo.png"
                  alt="Retro Lab"
                  width={140}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-10 object-contain"
                />
              </div>
            </Link>

            <p className="text-xs font-mono text-blue-400 font-bold">
              :: FROM IDEA &gt;&gt; TO PROTOTYPE ::
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
              Retro Lab is a modern, well-equipped workspace where you can work on robotics, electronics, research, and custom product development.
            </p>
          </div>

          {/* Column 2: Operating Hours */}
          <div>
            <h3 className="text-xs font-mono tracking-wider text-blue-400 font-bold uppercase mb-4">
              :: OPERATING HOURS ::
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#0066FF] mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white font-mono">Sunday – Thursday</div>
                  <div className="text-[11px] text-slate-400 font-mono">10:00 AM – 08:00 PM</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white font-mono">Maximum Capacity</div>
                  <div className="text-[11px] text-slate-400 font-mono">10 Benches / Time Slot</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div>
            <h3 className="text-xs font-mono tracking-wider text-blue-400 font-bold uppercase mb-4">
              :: LOCATION & CONTACT ::
            </h3>
            <ul className="space-y-3 text-xs text-slate-300 font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                <span>Changaw, Near Civil Department, Daffodil International University</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span className="font-mono text-xs">+880 1865-326474</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span className="font-mono text-xs">mail.retrolab@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <p>© 2025 RETRO LAB. All Rights Reserved. Designed by Engineers.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span>Daffodil International University</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              Admin Access <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
