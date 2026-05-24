import { useState } from 'react';
import type { Reward, RedemptionHistory } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { RewardCard } from '../components/rewards/RewardCard';
import { RewardModal } from '../components/rewards/RewardModal';
import { RedemptionHistoryList } from '../components/rewards/RedemptionHistoryList';
import { deductCoins } from '../utils/coins';

const MOCK_TOTAL_COINS = 120;

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [history, setHistory] = useState<RedemptionHistory[]>([]);
  const [totalCoins, setTotalCoins] = useState(MOCK_TOTAL_COINS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveReward = (reward: Reward) => {
    setRewards((prev) => [...prev, reward]);
  };

  const handleDeleteReward = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRedeem = (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (!reward) return;
    setTotalCoins((prev) => deductCoins(prev, reward.cost));
    const record: RedemptionHistory = {
      id: crypto.randomUUID(),
      rewardId: reward.id,
      rewardName: reward.name,
      rewardEmoji: reward.emoji,
      coinsCost: reward.cost,
      redeemedAt: new Date(),
    };
    setHistory((prev) => [record, ...prev]);
  };

  return (
    <div>
      <PageHeader title="Rewards" subtitle="Redeem your coins" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-cozy-text-secondary">
            Your coins: <span className="text-cozy-text-primary font-bold">🪙 {totalCoins}</span>
          </p>
          <Button onClick={() => setIsModalOpen(true)}>+ New reward</Button>
        </div>

        {rewards.length === 0 ? (
          <EmptyState message="No rewards yet — add one to motivate yourself" />
        ) : (
          <div className="space-y-3">
            {rewards.map((r) => (
              <RewardCard
                key={r.id}
                reward={r}
                currentCoins={totalCoins}
                onRedeem={handleRedeem}
                onDelete={handleDeleteReward}
              />
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-cozy-text-primary">Redemption history</h3>
          <RedemptionHistoryList history={history} />
        </div>
      </div>

      <RewardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReward}
      />
    </div>
  );
};

export default Rewards;
