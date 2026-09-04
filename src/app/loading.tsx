import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col items-center justify-center p-4 font-sans bg-blueprint">
      <div className="flex flex-col items-center space-y-4">
        {/* LOGO */}
        <Image
          src="/logo.png"
          alt="Retro Lab Loading"
          width={160}
          height={48}
          priority
          className="h-12 w-auto object-contain animate-pulse"
        />

        {/* MINIMALIST SLEEK LOADER BAR */}
        <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#0066FF] rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3" />
        </div>
      </div>
    </div>
  );
}

