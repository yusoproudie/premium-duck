interface StatsCardProps {
  label: string;
  value: number | string;
  maxValue?: number;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}

export const StatsCard = ({ label, value, maxValue, variant = 'default', onClick }: StatsCardProps) => {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={`bg-cozy-card rounded-xl p-5 border-2 cursor-pointer transition-shadow hover:shadow-md ${
        isPrimary ? 'border-cozy-blue' : 'border-cozy-border'
      }`}
      onClick={onClick}
    >
      <p className="text-xs text-cozy-text-secondary uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-cozy-text-primary">{value}</span>
        {maxValue !== undefined && (
          <span className="text-lg text-cozy-text-secondary">/{maxValue}</span>
        )}
      </div>
      {isPrimary && (
        <p className="text-xs text-cozy-text-secondary mt-2">Keep collecting daily</p>
      )}
    </div>
  );
};
