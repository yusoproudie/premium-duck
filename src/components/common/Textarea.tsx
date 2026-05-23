import React from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-cozy-text-primary mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-2.5 rounded-cozy border-2',
          'border-cozy-border bg-white',
          'text-cozy-text-primary placeholder:text-cozy-text-muted',
          'focus:outline-none focus:border-cozy-blue focus:ring-2 focus:ring-cozy-blue/20',
          'transition-colors duration-200 resize-vertical',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};
