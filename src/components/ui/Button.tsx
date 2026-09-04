import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-6 py-3 rounded-lg gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-sm hover:shadow active:scale-[0.98]',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow active:scale-[0.98]',
    outline:
      'bg-white hover:bg-blue-50/50 text-slate-800 border border-slate-300 hover:border-[#0066FF] hover:text-[#0066FF]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
