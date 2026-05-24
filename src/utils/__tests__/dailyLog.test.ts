import { calculateDayCoins, getDayStatus } from '../dailyLog';
import { DailyTask } from '../../types';

describe('calculateDayCoins', () => {
  // SR-44
  it('returns -10 when tasks array is empty (penalty)', () => {
    expect(calculateDayCoins([])).toBe(-10);
  });

  it('returns sum of task coins', () => {
    const tasks: DailyTask[] = [
      { id: '1', description: 'A', coins: 5, createdAt: new Date() },
      { id: '2', description: 'B', coins: 10, createdAt: new Date() },
    ];
    expect(calculateDayCoins(tasks)).toBe(15);
  });
});

describe('getDayStatus', () => {
  // SR-38, SR-39
  it('returns "penalty" when hasPenalty is true', () => {
    expect(getDayStatus({ hasPenalty: true, totalCoins: -10, tasks: [] } as any)).toBe('penalty');
  });

  it('returns "positive" when has tasks and coins > 0', () => {
    expect(getDayStatus({ hasPenalty: false, totalCoins: 15, tasks: [{}] } as any)).toBe('positive');
  });

  it('returns "default" when no entry', () => {
    expect(getDayStatus(null)).toBe('default');
  });
});
