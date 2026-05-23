import React from 'react';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction }) => {
  return (
    <div className="bg-white rounded-cozy-lg p-12 text-center shadow-cozy">
      <p className="text-cozy-text-secondary">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 text-cozy-blue hover:underline text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
