import React from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-cozy-text-primary mb-1.5">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-4 py-2.5 rounded-cozy border-2',
          'border-cozy-border bg-white',
          'text-cozy-text-primary',
          'focus:outline-none focus:border-cozy-blue focus:ring-2 focus:ring-cozy-blue/20',
          'transition-colors duration-200 cursor-pointer',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};
