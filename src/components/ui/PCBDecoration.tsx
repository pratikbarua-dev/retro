import React from 'react';

export const PCBTracePattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`pointer-events-none opacity-30 ${className}`}
      width="240"
      height="160"
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20 H80 L110 50 H180 L200 70 V140"
        stroke="#0066FF"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <path
        d="M30 140 V90 L60 60 H140 L160 40 V10"
        stroke="#0066FF"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="20" r="3" fill="#0066FF" />
      <circle cx="110" cy="50" r="3" fill="#0066FF" />
      <circle cx="200" cy="70" r="3" fill="#0066FF" />
      <circle cx="60" cy="60" r="3" fill="#0066FF" />
      <circle cx="160" cy="40" r="3" fill="#0066FF" />
    </svg>
  );
};
