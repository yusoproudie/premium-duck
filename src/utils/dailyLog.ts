import type { DailyLogEntry, DailyTask } from '../types';

export const calculateDayCoins = (tasks: DailyTask[]): number => {
  if (tasks.length === 0) return -10;
  return tasks.reduce((sum, task) => sum + task.coins, 0);
};

export const getDayStatus = (
  entry: DailyLogEntry | null | undefined
): 'positive' | 'penalty' | 'default' => {
  if (!entry) return 'default';
  if (entry.hasPenalty) return 'penalty';
  if (entry.totalCoins > 0) return 'positive';
  return 'default';
};
