import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'head' | 'body' | 'feet' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        {
          'bg-pink-100 text-pink-700': variant === 'head',
          'bg-yellow-100 text-yellow-700': variant === 'body',
          'bg-blue-100 text-blue-700': variant === 'feet',
          'bg-gray-100 text-gray-700': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
