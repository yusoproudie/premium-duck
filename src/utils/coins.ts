export const canAfford = (currentCoins: number, cost: number): boolean =>
  currentCoins >= cost;

export const deductCoins = (currentCoins: number, cost: number): number =>
  currentCoins - cost;
