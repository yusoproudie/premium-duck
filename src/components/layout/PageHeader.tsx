import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-cozy-text-secondary mb-1">Hello, Friend 👋</p>
          <h1 className="text-2xl font-bold text-cozy-text-primary">{title}</h1>
          {subtitle && (
            <p data-testid="subtitle" className="text-sm text-cozy-text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
