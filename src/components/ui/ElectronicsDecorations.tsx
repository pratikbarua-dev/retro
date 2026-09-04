'use client';

import React from 'react';

/**
 * Clean blueprint technical SVG vectors of electronics components based on the RETRO LAB schematic branding.
 */

export const ResistorIcon = ({ className = "w-6 h-6 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 20H10L12.5 13L17.5 27L22.5 13L27.5 27L30 20H38" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChipDIP16 = ({ className = "w-8 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="12" y="8" width="26" height="34" rx="2" strokeLinejoin="round" />
    <path d="M21 8C21 10.2091 22.7909 12 25 12C27.2091 12 29 10.2091 29 8" strokeLinejoin="round" />
    {/* Left pins */}
    <path d="M5 12H12M5 18H12M5 24H12M5 30H12M5 36H12" strokeLinecap="round" />
    {/* Right pins */}
    <path d="M38 12H45M38 18H45M38 24H45M38 30H45M38 36H45" strokeLinecap="round" />
  </svg>
);

export const ChipQFP = ({ className = "w-10 h-10 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="15" y="15" width="30" height="30" rx="3" strokeLinejoin="round" />
    <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.6" />
    {/* Pins top/bottom */}
    <path d="M20 5V15M25 5V15M30 5V15M35 5V15M40 5V15" strokeLinecap="round" />
    <path d="M20 45V55M25 45V55M30 45V55M35 45V55M40 45V55" strokeLinecap="round" />
    {/* Pins left/right */}
    <path d="M5 20H15M5 25H15M5 30H15M5 35H15M5 40H15" strokeLinecap="round" />
    <path d="M45 20H55M45 25H55M45 30H55M45 35H55M45 40H55" strokeLinecap="round" />
  </svg>
);

export const LEDIcon = ({ className = "w-8 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Bulb */}
    <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20V26H12V20Z" strokeLinejoin="round" />
    <line x1="12" y1="26" x2="28" y2="26" strokeLinecap="round" />
    {/* Anode & Cathode leads */}
    <line x1="16" y1="26" x2="16" y2="36" strokeLinecap="round" />
    <line x1="24" y1="26" x2="24" y2="36" strokeLinecap="round" />
    {/* Light rays */}
    <path d="M27 10L32 5M30 14L36 9" strokeLinecap="round" />
  </svg>
);

export const CapacitorIcon = ({ className = "w-7 h-7 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="13" y="10" width="14" height="20" rx="7" />
    <line x1="10" y1="14" x2="30" y2="14" strokeDasharray="1 1" />
    <line x1="17" y1="30" x2="17" y2="38" strokeLinecap="round" />
    <line x1="23" y1="30" x2="23" y2="38" strokeLinecap="round" />
    <path d="M15 17H19M17 15V19" strokeLinecap="round" opacity="0.7" />
  </svg>
);

export const TransistorIcon = ({ className = "w-8 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 12C12 12 12 24 20 24C28 24 28 12 28 12H12Z" />
    <line x1="15" y1="24" x2="15" y2="36" strokeLinecap="round" />
    <line x1="20" y1="24" x2="20" y2="36" strokeLinecap="round" />
    <line x1="25" y1="24" x2="25" y2="36" strokeLinecap="round" />
    <text x="14" y="20" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">NPN</text>
  </svg>
);

export const SevenSegmentIcon = ({ className = "w-8 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="10" y="6" width="20" height="28" rx="2" />
    {/* 8 figure */}
    <path d="M15 10H25M15 10V18M25 10V18M15 18H25M15 18V26M25 18V26M15 26H25" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    <circle cx="27" cy="28" r="1" fill="currentColor" />
  </svg>
);

export const TactileButtonIcon = ({ className = "w-8 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="10" y="10" width="20" height="20" rx="3" />
    <circle cx="20" cy="20" r="6" strokeLinejoin="round" />
    <line x1="6" y1="13" x2="10" y2="13" />
    <line x1="6" y1="27" x2="10" y2="27" />
    <line x1="30" y1="13" x2="34" y2="13" />
    <line x1="30" y1="27" x2="34" y2="27" />
  </svg>
);

export const ServoMotorIcon = ({ className = "w-9 h-9 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="10" y="18" width="30" height="22" rx="2" />
    <circle cx="20" cy="24" r="4" />
    <path d="M20 20L34 14C35.5 13.5 37 15 36.5 16.5L32 26" strokeLinecap="round" />
    <rect x="6" y="24" width="4" height="10" rx="1" />
    <rect x="40" y="24" width="4" height="10" rx="1" />
  </svg>
);

export const UltrasonicSensorIcon = ({ className = "w-10 h-7 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="8" y="10" width="44" height="22" rx="3" />
    <circle cx="20" cy="21" r="7" />
    <circle cx="20" cy="21" r="3" />
    <circle cx="40" cy="21" r="7" />
    <circle cx="40" cy="21" r="3" />
    <line x1="22" y1="32" x2="22" y2="37" />
    <line x1="27" y1="32" x2="27" y2="37" />
    <line x1="33" y1="32" x2="33" y2="37" />
    <line x1="38" y1="32" x2="38" y2="37" />
  </svg>
);

export const BreadboardIcon = ({ className = "w-10 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="8" width="48" height="24" rx="2" />
    <line x1="6" y1="20" x2="54" y2="20" strokeDasharray="2 2" opacity="0.6" />
    {/* Grid points */}
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <circle cx="22" cy="14" r="1" fill="currentColor" />
    <circle cx="30" cy="14" r="1" fill="currentColor" />
    <circle cx="38" cy="14" r="1" fill="currentColor" />
    <circle cx="46" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="26" r="1" fill="currentColor" />
    <circle cx="22" cy="26" r="1" fill="currentColor" />
    <circle cx="30" cy="26" r="1" fill="currentColor" />
    <circle cx="38" cy="26" r="1" fill="currentColor" />
    <circle cx="46" cy="26" r="1" fill="currentColor" />
  </svg>
);

export const DiodeIcon = ({ className = "w-7 h-7 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="5" y1="20" x2="15" y2="20" />
    <path d="M15 12L27 20L15 28V12Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <line x1="27" y1="12" x2="27" y2="28" strokeWidth="2" />
    <line x1="27" y1="20" x2="35" y2="20" />
  </svg>
);

export const WaveformIcon = ({ className = "w-8 h-8 text-blue-600/40" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 20C8 10 12 10 16 20C20 30 24 30 28 20C32 10 36 10 40 20" strokeLinecap="round" />
  </svg>
);

/**
 * Floating margin background decorations component that renders scattered components along container borders,
 * matching the prompt image!
 */
export function SchematicMarginDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* FOUR CORNER SCHEMATIC SCREWS */}
      <div className="absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-[#0066FF] shadow-xs" />
      <div className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-[#0066FF] shadow-xs" />
      <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-[#0066FF] shadow-xs" />
      <div className="absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-[#0066FF] shadow-xs" />

      {/* LEFT MARGIN ELECTRONICS ICONS */}
      <div className="absolute left-3 top-24 opacity-60 hover:opacity-100 transition-opacity">
        <ResistorIcon className="w-8 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute left-3 top-48 opacity-60 hover:opacity-100 transition-opacity">
        <WaveformIcon className="w-8 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute left-3 top-72 opacity-60 hover:opacity-100 transition-opacity">
        <LEDIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute left-3 top-96 opacity-60 hover:opacity-100 transition-opacity">
        <CapacitorIcon className="w-8 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute left-3 top-[30rem] opacity-60 hover:opacity-100 transition-opacity">
        <TransistorIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute left-3 top-[36rem] opacity-60 hover:opacity-100 transition-opacity">
        <SevenSegmentIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute left-3 top-[42rem] opacity-60 hover:opacity-100 transition-opacity">
        <TactileButtonIcon className="w-9 h-9 text-[#0066FF]" />
      </div>

      {/* RIGHT MARGIN ELECTRONICS ICONS */}
      <div className="absolute right-4 top-24 opacity-60 hover:opacity-100 transition-opacity">
        <ChipQFP className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute right-4 top-48 opacity-60 hover:opacity-100 transition-opacity">
        <DiodeIcon className="w-8 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute right-4 top-72 opacity-60 hover:opacity-100 transition-opacity">
        <ResistorIcon className="w-8 h-8 text-[#0066FF] rotate-90" />
      </div>
      <div className="absolute right-4 top-96 opacity-60 hover:opacity-100 transition-opacity">
        <ChipDIP16 className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute right-4 top-[30rem] opacity-60 hover:opacity-100 transition-opacity">
        <ServoMotorIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute right-4 top-[36rem] opacity-60 hover:opacity-100 transition-opacity">
        <UltrasonicSensorIcon className="w-10 h-7 text-[#0066FF]" />
      </div>

      {/* BOTTOM MARGIN ELECTRONICS ICONS */}
      <div className="absolute bottom-4 left-24 opacity-60 hover:opacity-100 transition-opacity">
        <BreadboardIcon className="w-10 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute bottom-4 right-24 opacity-60 hover:opacity-100 transition-opacity">
        <ChipDIP16 className="w-9 h-9 text-[#0066FF] rotate-90" />
      </div>
    </div>
  );
}

/**
 * Full page ambient overlay scattering electronics components randomly across the background grid,
 * creating an authentic engineering blueprint schematic feel across the full page surface.
 */
export function FullPageSchematicOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* HIGH DENSITY SCATTERED ELECTRONICS OBJECTS */}

      {/* REGION 1: TOP 0% - 25% */}
      <div className="absolute top-[4%] left-[10%] opacity-30 rotate-12">
        <ResistorIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[6%] left-[32%] opacity-35 -rotate-45">
        <ChipDIP16 className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[5%] left-[52%] opacity-30 rotate-90">
        <LEDIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute top-[8%] left-[75%] opacity-35 -rotate-12">
        <ChipQFP className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[14%] left-[22%] opacity-30 rotate-45">
        <TransistorIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute top-[16%] left-[42%] opacity-35">
        <WaveformIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[15%] left-[88%] opacity-30 -rotate-45">
        <CapacitorIcon className="w-9 h-9 text-[#0066FF]" />
      </div>

      {/* REGION 2: MID-TOP 25% - 50% */}
      <div className="absolute top-[26%] left-[8%] opacity-35 -rotate-12">
        <SevenSegmentIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[28%] left-[36%] opacity-30 rotate-12">
        <TactileButtonIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[30%] left-[64%] opacity-35 rotate-45">
        <ServoMotorIcon className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[32%] left-[86%] opacity-30 -rotate-90">
        <DiodeIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute top-[38%] left-[18%] opacity-30 rotate-90">
        <UltrasonicSensorIcon className="w-11 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute top-[40%] left-[46%] opacity-35 -rotate-12">
        <ChipDIP16 className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[42%] left-[72%] opacity-30 rotate-12">
        <BreadboardIcon className="w-11 h-8 text-[#0066FF]" />
      </div>

      {/* REGION 3: MID-BOTTOM 50% - 75% */}
      <div className="absolute top-[52%] left-[12%] opacity-35 rotate-45">
        <ResistorIcon className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[54%] left-[38%] opacity-30 -rotate-45">
        <ChipQFP className="w-12 h-12 text-[#0066FF]" />
      </div>
      <div className="absolute top-[56%] left-[60%] opacity-35 rotate-90">
        <LEDIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[58%] left-[82%] opacity-30 -rotate-12">
        <TransistorIcon className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[64%] left-[24%] opacity-30 rotate-12">
        <CapacitorIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute top-[66%] left-[50%] opacity-35 -rotate-90">
        <WaveformIcon className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[68%] left-[76%] opacity-30 rotate-45">
        <TactileButtonIcon className="w-10 h-10 text-[#0066FF]" />
      </div>

      {/* REGION 4: BOTTOM 75% - 100% */}
      <div className="absolute top-[76%] left-[10%] opacity-35 -rotate-12">
        <ServoMotorIcon className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[78%] left-[34%] opacity-30 rotate-45">
        <DiodeIcon className="w-9 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute top-[80%] left-[58%] opacity-35 -rotate-45">
        <SevenSegmentIcon className="w-11 h-11 text-[#0066FF]" />
      </div>
      <div className="absolute top-[82%] left-[84%] opacity-30 rotate-90">
        <ChipDIP16 className="w-10 h-10 text-[#0066FF]" />
      </div>
      <div className="absolute top-[88%] left-[20%] opacity-30 rotate-12">
        <UltrasonicSensorIcon className="w-11 h-8 text-[#0066FF]" />
      </div>
      <div className="absolute top-[90%] left-[44%] opacity-35 -rotate-12">
        <BreadboardIcon className="w-12 h-9 text-[#0066FF]" />
      </div>
      <div className="absolute top-[92%] left-[70%] opacity-30 rotate-45">
        <ResistorIcon className="w-11 h-11 text-[#0066FF]" />
      </div>

      {/* DENSE CIRCUIT SCHEMATIC TRACE LINES */}
      <svg className="absolute inset-0 w-full h-full text-[#0066FF]/25" fill="none">
        <path d="M 10% 5% H 32% V 16%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 52% 6% H 75% V 28%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 8% 27% V 38% H 46%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 64% 31% V 42% H 72%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 12% 53% H 38% V 64%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 60% 57% V 66% H 76%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 34% 79% H 58% V 90%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
      </svg>
    </div>
  );
}

