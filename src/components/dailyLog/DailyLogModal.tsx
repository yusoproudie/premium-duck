import { useState } from 'react';
import type { DailyTask } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  tasks: DailyTask[];
  onSaveTasks: (date: Date, tasks: DailyTask[]) => void;
}

const DEFAULT_COINS = 5;

export const DailyLogModal = ({
  isOpen,
  onClose,
  selectedDate,
  tasks: initialTasks,
  onSaveTasks,
}: DailyLogModalProps) => {
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
  const [description, setDescription] = useState('');

  const dateLabel = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalCoins = tasks.reduce((sum, t) => sum + t.coins, 0);

  const handleAdd = () => {
    if (!description.trim()) return;
    const newTask: DailyTask = {
      id: crypto.randomUUID(),
      description: description.trim(),
      coins: DEFAULT_COINS,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    setDescription('');
  };

  const handleRemove = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    onSaveTasks(selectedDate, tasks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dateLabel}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-cozy-text-secondary">
          <span>Total:</span>
          <span>🪙 {totalCoins}</span>
        </div>

        {tasks.length > 0 && (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between bg-cozy-bg rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-cozy-text-primary">{task.description}</p>
                  <p className="text-xs text-cozy-text-secondary">🪙 {task.coins} coins</p>
                </div>
                <button
                  aria-label="Remove task"
                  onClick={() => handleRemove(task.id)}
                  className="text-cozy-text-secondary hover:text-red-400 transition-colors p-1"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="What did you do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} aria-label="Add task">
            Add task
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};
