import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'navy' | 'green' | 'amber' | 'red' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-[#0066FF] border-blue-200',
    navy: 'bg-slate-900 text-white border-slate-700',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    outline: 'bg-white text-slate-700 border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-mono tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
