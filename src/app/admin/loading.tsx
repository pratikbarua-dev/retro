import React from 'react';
import Image from 'next/image';

export default function AdminLoading() {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/logo.png"
        alt="Loading"
        width={140}
        height={40}
        priority
        className="h-10 w-auto object-contain animate-pulse"
      />
      <div className="w-28 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-[#0066FF] rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3" />
      </div>
    </div>
  );
}

