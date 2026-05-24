import { canAfford, deductCoins } from '../coins';

describe('canAfford', () => {
  // SR-53
  it('returns true when current coins >= cost', () => {
    expect(canAfford(100, 50)).toBe(true);
    expect(canAfford(50, 50)).toBe(true);
  });

  it('returns false when current coins < cost', () => {
    expect(canAfford(30, 50)).toBe(false);
  });
});

describe('deductCoins', () => {
  // SR-52
  it('subtracts cost from total', () => {
    expect(deductCoins(100, 50)).toBe(50);
  });

  it('can result in negative (edge case)', () => {
    expect(deductCoins(10, 50)).toBe(-40);
  });
});
