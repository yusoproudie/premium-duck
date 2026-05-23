import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'font-medium rounded-cozy transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center gap-2',
        {
          'bg-cozy-yellow text-cozy-text-primary hover:bg-cozy-yellow-dark shadow-cozy': variant === 'primary',
          'bg-cozy-blue text-white hover:bg-cozy-blue-dark shadow-cozy': variant === 'secondary',
          'border-2 border-red-500 text-red-500 hover:bg-red-50': variant === 'danger',
          'text-cozy-text-secondary hover:bg-cozy-yellow-light': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2.5 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        { 'w-full': fullWidth },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
