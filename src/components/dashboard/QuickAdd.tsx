import { useState } from 'react';

interface QuickAddProps {
  onAddTask: (description: string, coins: number) => void;
}

export const QuickAdd = ({ onAddTask }: QuickAddProps) => {
  const [task, setTask] = useState('');
  const [coins, setCoins] = useState('5');

  const handleSubmit = () => {
    if (!task.trim()) return;
    onAddTask(task.trim(), Number(coins) || 0);
    setTask('');
    setCoins('5');
  };

  return (
    <div className="bg-cozy-card rounded-xl p-5 border border-cozy-border space-y-4">
      <h2 className="text-sm font-semibold text-cozy-text-primary uppercase tracking-wider">Quick Add</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="What did you do?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary placeholder:text-cozy-text-secondary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            className="w-24 bg-cozy-bg border border-cozy-border rounded-lg px-3 py-2 text-sm text-cozy-text-primary focus:outline-none focus:ring-2 focus:ring-cozy-yellow"
          />
          <button
            onClick={handleSubmit}
            className="flex-1 bg-cozy-yellow text-cozy-bg font-semibold text-sm rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Log it
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-cozy-text-secondary uppercase tracking-wider mb-2">
          Upcoming goals
        </h3>
        <p className="text-sm text-cozy-text-secondary">No goals yet.</p>
      </div>
    </div>
  );
};
