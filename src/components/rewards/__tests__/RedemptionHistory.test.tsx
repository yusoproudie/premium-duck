import { render, screen } from '../../../test-utils/render';
import { RedemptionHistoryList } from '../RedemptionHistoryList';
import type { RedemptionHistory } from '../../../types';

const mockHistory: RedemptionHistory[] = [
  {
    id: 'rh-1',
    rewardId: 'r-1',
    rewardName: 'Coffee Break',
    rewardEmoji: '☕',
    coinsCost: 50,
    redeemedAt: new Date('2026-05-10'),
  },
];

describe('RedemptionHistoryList', () => {
  // SR-54
  it('renders history items', () => {
    render(<RedemptionHistoryList history={mockHistory} />);
    expect(screen.getByText('Coffee Break')).toBeInTheDocument();
    expect(screen.getByText('☕')).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('renders empty state when no history', () => {
    render(<RedemptionHistoryList history={[]} />);
    expect(screen.getByText(/no redemptions yet/i)).toBeInTheDocument();
  });

  it('renders date of redemption', () => {
    render(<RedemptionHistoryList history={mockHistory} />);
    expect(screen.getByText(/May 10, 2026/)).toBeInTheDocument();
  });
});
