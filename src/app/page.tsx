import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Retro Lab | Pay-per-Slot Hardware & Robotics Workspace',
  description:
    'Book ESD-safe electronics workbenches, access digital oscilloscopes, soldering tools, component inventory, and engineering mentorship at Retro Lab, Daffodil Smart City.',
  openGraph: {
    title: 'Retro Lab | Pay-per-Slot Hardware & Robotics Workspace',
    description:
      'Book ESD-safe electronics workbenches, access digital oscilloscopes, soldering tools, component inventory, and engineering mentorship at Retro Lab, Daffodil Smart City.',
    url: 'https://retrolab.com',
    images: ['/logo.png'],
  },
};

import {
  ArrowRight,
  Cpu,
  Wrench,
  Users,
  Wifi,
  Check,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  MapPin,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PCBTracePattern } from '@/components/ui/PCBDecoration';
import {
  SchematicMarginDecorations,
  FullPageSchematicOverlay,
  ResistorIcon,
  ChipDIP16,
  ChipQFP,
  LEDIcon,
  CapacitorIcon,
  TransistorIcon,
  SevenSegmentIcon,
  TactileButtonIcon,
  ServoMotorIcon,
  UltrasonicSensorIcon,
  BreadboardIcon,
  DiodeIcon,
  WaveformIcon,
} from '@/components/ui/ElectronicsDecorations';
import { initialPackages, initialFacilities } from '@/lib/db/seed-data';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* ==================================================
            SECTION 1 — HERO
        ================================================== */}
        <section className="relative pt-6 pb-12 md:pt-8 md:pb-16 bg-[#EEF6FF] bg-blueprint border-b border-slate-200 overflow-hidden">
          {/* PCB Circuit Traces & Decorative Blueprint Overlays */}
          <PCBTracePattern className="absolute top-0 right-0 hidden lg:block text-blue-500/30" />
          <SchematicMarginDecorations />
          <FullPageSchematicOverlay />

          {/* RIGHT SIDE HERO IMAGE (SPANS FULL HERO SECTION HEIGHT) */}
          <div className="absolute top-0 right-0 w-full lg:w-[54%] xl:w-[53%] h-full z-0 overflow-hidden pointer-events-none hidden lg:block">
            <Image
              src="/images/hero.png"
              alt="RETRO LAB Electronics Workspace"
              width={1400}
              height={800}
              priority
              style={{ width: '100%', height: '100%' }}
              className="w-full h-full object-cover object-left-top"
            />
            {/* SEAMLESS GRADIENT FADE ON LEFT EDGE */}
            <div className="absolute inset-y-0 left-0 w-64 sm:w-80 bg-gradient-to-r from-[#EEF6FF] via-[#EEF6FF]/85 to-transparent z-10" />
            {/* TOP SHADOW GRADIENT */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#EEF6FF]/60 via-transparent to-transparent z-10" />
            {/* BOTTOM SHADOW GRADIENT */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#EEF6FF] via-[#EEF6FF]/70 to-transparent z-10" />
          </div>

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]">
              {/* LEFT COLUMN: HERO TYPOGRAPHY & CARDS */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-6 z-20 pt-4">
                <div className="flex gap-4">
                  {/* VERTICAL MARGIN INDEX (01, 02, 03) */}
                  <div className="hidden sm:flex flex-col items-center justify-between font-mono text-[10px] text-blue-500/80 py-1 pr-3 border-r border-blue-400/30 select-none shrink-0">
                    <span>01</span>
                    <span className="h-8 w-px bg-blue-300/50 my-2"></span>
                    <span>02</span>
                    <span className="h-8 w-px bg-blue-300/50 my-2"></span>
                    <span>03</span>
                  </div>

                  <div className="space-y-4 max-w-xl">
                    {/* FROM IDEA >> TO PROTOTYPE HEADER BADGE */}
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 tracking-widest font-bold">
                      <span className="h-px w-5 bg-blue-500"></span>
                      FROM IDEA &gt;&gt; TO PROTOTYPE
                      <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] font-mono">
                      A HANDS-ON <br />
                      <span className="text-[#0066FF]">ELECTRONICS AND</span> <br />
                      <span className="text-[#0066FF]">ROBOTICS WORKSPACE</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl leading-relaxed pt-1">
                      <span className="font-semibold text-slate-800">Tools. Components. Mentoring.</span><br />
                      Everything you need to build, test, and learn.
                    </p>
                  </div>
                </div>

                {/* HERO CTA BUTTONS (RESPONSIVE FULL-WIDTH ON MOBILE, ROW ON SM+) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 sm:pl-9 pt-1">
                  <Link href="/book" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-[#0066FF] hover:bg-blue-600 text-white font-mono font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 group flex items-center justify-center gap-2.5 text-sm">
                      Book a Slot
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/facilities" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-400 text-blue-600 hover:bg-blue-50/80 font-mono font-semibold px-7 py-4 rounded-xl text-sm bg-white/70 flex items-center justify-center">
                      Explore Facilities
                    </Button>
                  </Link>
                </div>

                {/* 4 FEATURE INDICATORS CARDS (RESPONSIVE GRID: 2 COLUMNS ON MOBILE, 4 ON DESKTOP) */}
                <div className="sm:ml-9 pt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/85 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 shadow-sm max-w-xl">
                  <div className="space-y-1">
                    <Cpu className="w-5 h-5 text-[#0066FF]" />
                    <div className="text-xs font-mono font-bold text-slate-900">WORKSPACE</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Dedicated benches and power supply</div>
                  </div>

                  <div className="space-y-1 border-l border-slate-200/80 pl-3">
                    <Wrench className="w-5 h-5 text-[#0066FF]" />
                    <div className="text-xs font-mono font-bold text-slate-900">TOOL ACCESS</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Electronics, robotics and testing tools</div>
                  </div>

                  <div className="space-y-1 sm:border-l sm:border-slate-200/80 sm:pl-3">
                    <Users className="w-5 h-5 text-[#0066FF]" />
                    <div className="text-xs font-mono font-bold text-slate-900">MENTORING</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Guidance from experienced makers</div>
                  </div>

                  <div className="space-y-1 border-l border-slate-200/80 pl-3">
                    <Wifi className="w-5 h-5 text-[#0066FF]" />
                    <div className="text-xs font-mono font-bold text-slate-900">HIGH SPEED WIFI</div>
                    <div className="text-[11px] text-slate-500 leading-tight">Stay connected and productive</div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN OVERLAYS */}
              <div className="lg:col-span-5 xl:col-span-5 relative min-h-[280px] sm:min-h-[320px] lg:min-h-[460px] flex flex-col justify-between items-end pointer-events-none z-20">
                {/* TOP RIGHT SCHEMATIC CATEGORIES */}
                <div className="hidden lg:block text-right font-mono text-[10px] text-slate-500 tracking-widest leading-relaxed uppercase border-r-2 border-blue-400/40 pr-3 pt-2">
                  <div>CIRCUITS</div>
                  <div>ROBOTICS</div>
                  <div>PROTOTYPING</div>
                  <div>LEARNING</div>
                  <div>COMMUNITY</div>
                </div>

                {/* MOBILE HERO IMAGE FALLBACK (VISIBLE ONLY ON MOBILE/TABLET < LG) */}
                <div className="lg:hidden w-full rounded-2xl overflow-hidden shadow-xl border border-slate-300 pointer-events-auto my-4">
                  <Image
                    src="/images/hero.png"
                    alt="RETRO LAB Electronics Workspace"
                    width={800}
                    height={450}
                    priority
                    className="w-full h-60 sm:h-72 object-cover object-left-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 2 — BOOK YOUR BENCH (6 PACKAGES)
        ================================================== */}
        <section className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
          <SchematicMarginDecorations />
          <FullPageSchematicOverlay />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <Badge variant="blue" className="mb-3">
                :: BOOKING PACKAGES ::
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                BOOK YOUR BENCH
              </h2>
              <p className="text-base text-slate-600 mt-2">
                Choose the team size that fits your project. Pay per hour with zero hidden fees.
              </p>
            </div>

            {/* 6 PACKAGE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialPackages.filter((pkg) => pkg.id !== 'pack_consultation').map((pkg) => {

                const isCustom = pkg.isCustom;

                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-xl bg-white border p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                      isCustom
                        ? 'border-2 border-[#0066FF] shadow-md ring-4 ring-blue-500/10'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {isCustom && (
                      <div className="absolute -top-3 right-4 bg-[#0066FF] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        POPULAR CHOICE
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                          {pkg.id === 'pack_solo' && <LEDIcon className="w-6 h-6 text-[#0066FF]" />}
                          {pkg.id === 'pack_pair' && <ResistorIcon className="w-6 h-6 text-[#0066FF]" />}
                          {pkg.id === 'pack_squad' && <TransistorIcon className="w-6 h-6 text-[#0066FF]" />}
                          {pkg.id === 'pack_team' && <ChipDIP16 className="w-6 h-6 text-[#0066FF]" />}
                          {pkg.id === 'pack_crew' && <ChipQFP className="w-6 h-6 text-[#0066FF]" />}
                          {isCustom && <Sliders className="w-5 h-5 text-[#0066FF]" />}
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {isCustom ? '1–10 Members' : `${pkg.minMembers} ${pkg.minMembers === 1 ? 'Person' : 'Persons'}`}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                        {pkg.name}
                      </h3>

                      <div className="mt-3 mb-4">
                        {isCustom ? (
                          <div>
                            <span className="text-3xl font-extrabold text-[#0066FF]">Dynamic</span>
                            <span className="text-sm text-slate-500 font-mono ml-2">Pricing</span>
                            <p className="text-xs text-slate-500 mt-1">
                              Custom pack description: Build a session that fits your project.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <span className="text-3xl font-extrabold text-slate-900">৳{pkg.price}</span>
                            <span className="text-sm text-slate-500 font-mono"> / 2 hrs</span>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#0066FF]" />
                          ESD-safe workstation & power
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#0066FF]" />
                          Electronics & robotics tools access
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#0066FF]" />
                          100 Mbps Wi-Fi & mentoring
                        </li>
                      </ul>
                    </div>

                    <Link href={`/book?package=${pkg.id}`} className="w-full">
                      <Button
                        variant={isCustom ? 'primary' : 'outline'}
                        size="md"
                        className="w-full justify-center"
                      >
                        {isCustom ? 'Customize Pack →' : 'Book Now'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 3 — FREE PROJECT CONSULTATION
        ================================================== */}
        <section className="py-20 bg-white border-b border-slate-200 bg-blueprint relative overflow-hidden">
          <SchematicMarginDecorations />
          <FullPageSchematicOverlay />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <Badge variant="blue" className="mb-3 font-mono text-xs">
                :: ENGINEERING MENTORSHIP & REVIEW ::
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                HARDWARE & PROJECT CONSULTATION
              </h2>
              <p className="text-base text-slate-600 mt-2">
                Need guidance on circuit schematics, motor drivers, sensor integration, or code debugging? Book a 1-on-1 session with expert makers.
              </p>
            </div>

            {/* CONSULTATION HIGHLIGHT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-mono">Schematic Review</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Pinout validation, power distribution, and component verification.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-mono">Firmware Debugging</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Arduino, STM32, ESP32, and Raspberry Pi embedded code support.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-mono">Sensor Integration</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Interfacing IMUs, LiDAR, encoders, and communication modules.</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-mono">1-on-1 Mentoring</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Tailored guidance for thesis, robotics competitions, and capstone projects.</p>
              </div>
            </div>

            {/* DIRECT CONSULTATION CTA */}
            <div className="bg-gradient-to-r from-blue-50 via-white to-slate-50 text-slate-900 rounded-2xl p-8 sm:p-10 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/5 relative overflow-hidden tech-corner-box">
              <div className="space-y-2 text-center sm:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[#0066FF] text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                  :: PRACTICAL ENGINEERING SUPPORT ::
                </div>
                <h3 className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
                  Book a 1-on-1 Mentor Consultation
                </h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Need guidance on your robotics project, circuit debugging, or thesis prototype? Select your preferred date and reserve a mentorship session.
                </p>
              </div>
              <Link href="/book?package=pack_consultation" className="relative z-10 shrink-0">
                <Button variant="primary" size="lg" className="shadow-lg shadow-blue-500/20 px-6 py-3 font-mono font-bold">
                  Book Consultation →
                </Button>
              </Link>
            </div>
          </div>
        </section>      </main>

      <Footer />
    </div>
  );
}
