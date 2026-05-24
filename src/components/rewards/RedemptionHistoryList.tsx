import type { RedemptionHistory } from '../../types';

interface RedemptionHistoryListProps {
  history: RedemptionHistory[];
}

export const RedemptionHistoryList = ({ history }: RedemptionHistoryListProps) => {
  if (history.length === 0) {
    return (
      <p className="text-sm text-cozy-text-secondary text-center py-6">
        No redemptions yet
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {history.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between bg-cozy-card rounded-xl border border-cozy-border px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <span>{item.rewardEmoji}</span>
            <div>
              <p className="text-sm font-medium text-cozy-text-primary">{item.rewardName}</p>
              <p className="text-xs text-cozy-text-secondary">
                {new Date(item.redeemedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <span className="text-sm text-cozy-text-secondary">🪙 {item.coinsCost}</span>
        </li>
      ))}
    </ul>
  );
};
