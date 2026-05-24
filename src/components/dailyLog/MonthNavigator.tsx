interface MonthNavigatorProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export const MonthNavigator = ({ currentDate, onPrevious, onNext }: MonthNavigatorProps) => {
  const label = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        aria-label="Previous month"
        onClick={onPrevious}
        className="p-2 rounded-lg hover:bg-cozy-border transition-colors text-cozy-text-primary"
      >
        ‹
      </button>
      <h2 className="text-lg font-semibold text-cozy-text-primary">{label}</h2>
      <button
        aria-label="Next month"
        onClick={onNext}
        className="p-2 rounded-lg hover:bg-cozy-border transition-colors text-cozy-text-primary"
      >
        ›
      </button>
    </div>
  );
};
