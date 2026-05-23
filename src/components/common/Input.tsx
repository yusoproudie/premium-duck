import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-cozy-text-primary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2.5 rounded-cozy border-2',
          'border-cozy-border bg-white',
          'text-cozy-text-primary placeholder:text-cozy-text-muted',
          'focus:outline-none focus:border-cozy-blue focus:ring-2 focus:ring-cozy-blue/20',
          'transition-colors duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};
