import type { Reward } from '../../types';
import { canAfford } from '../../utils/coins';

interface RewardCardProps {
  reward: Reward;
  currentCoins: number;
  onRedeem: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RewardCard = ({ reward, currentCoins, onRedeem, onDelete }: RewardCardProps) => {
  const affordable = canAfford(currentCoins, reward.cost);

  const handleDelete = () => {
    if (window.confirm(`Delete reward "${reward.name}"?`)) {
      onDelete(reward.id);
    }
  };

  return (
    <div className="bg-cozy-card rounded-xl border-2 border-cozy-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{reward.emoji}</span>
          <div>
            <p className="font-semibold text-cozy-text-primary">{reward.name}</p>
            <p className="text-xs text-cozy-text-secondary">🪙 {reward.cost} coins</p>
          </div>
        </div>
        <button
          aria-label="Delete reward"
          onClick={handleDelete}
          className="text-cozy-text-secondary hover:text-red-400 transition-colors p-1 shrink-0"
        >
          🗑
        </button>
      </div>

      <p className="text-sm text-cozy-text-secondary">{reward.description}</p>

      <div className="flex items-center justify-between">
        {!affordable && (
          <span className="text-xs text-red-400">Not enough coins</span>
        )}
        <button
          aria-label="Redeem reward"
          onClick={() => onRedeem(reward.id)}
          disabled={!affordable}
          className="ml-auto px-4 py-2 rounded-lg bg-cozy-yellow text-cozy-bg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Redeem
        </button>
      </div>
    </div>
  );
};
