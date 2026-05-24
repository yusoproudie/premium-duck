import { useState } from 'react';
import type { Reward } from '../../types';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reward: Reward) => void;
}

export const RewardModal = ({ isOpen, onClose, onSave }: RewardModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎁');
  const [cost, setCost] = useState(50);
  const [nameError, setNameError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    const reward: Reward = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      emoji,
      cost,
      createdAt: new Date(),
    };
    onSave(reward);
    setName('');
    setDescription('');
    setEmoji('🎁');
    setCost(50);
    setNameError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-cozy-card rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cozy-text-primary">New reward</h2>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-cozy-text-secondary hover:text-cozy-text-primary"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1">
          <label htmlFor="reward-name" className="text-sm font-medium text-cozy-text-secondary">
            Name
          </label>
          <input
            id="reward-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(''); }}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
          {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="reward-description" className="text-sm font-medium text-cozy-text-secondary">
            Description
          </label>
          <input
            id="reward-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="reward-emoji" className="text-sm font-medium text-cozy-text-secondary">
            Emoji
          </label>
          <input
            id="reward-emoji"
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="reward-cost" className="text-sm font-medium text-cozy-text-secondary">
            Cost (coins)
          </label>
          <input
            id="reward-cost"
            type="number"
            min={1}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-cozy-border text-sm text-cozy-text-secondary hover:bg-cozy-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg bg-cozy-yellow text-cozy-bg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
