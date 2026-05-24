import { render, screen, fireEvent } from '../../../test-utils/render';
import { RewardCard } from '../RewardCard';
import type { Reward } from '../../../types';

const mockReward: Reward = {
  id: 'reward-1',
  name: 'Coffee Break',
  description: 'Treat yourself to a nice coffee',
  emoji: '☕',
  cost: 50,
  createdAt: new Date(),
};

describe('RewardCard', () => {
  const defaultProps = {
    reward: mockReward,
    currentCoins: 100,
    onRedeem: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onRedeem.mockClear();
    defaultProps.onDelete.mockClear();
  });

  // SR-50
  it('renders reward name', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('Coffee Break')).toBeInTheDocument();
  });

  it('renders emoji', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('☕')).toBeInTheDocument();
  });

  it('renders cost', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('Treat yourself to a nice coffee')).toBeInTheDocument();
  });

  // SR-52
  it('calls onRedeem when Redeem button clicked and has enough coins', () => {
    render(<RewardCard {...defaultProps} currentCoins={100} />);
    fireEvent.click(screen.getByRole('button', { name: /redeem/i }));
    expect(defaultProps.onRedeem).toHaveBeenCalledWith('reward-1');
  });

  // SR-53
  it('disables Redeem button when coins insufficient', () => {
    render(<RewardCard {...defaultProps} currentCoins={20} />);
    expect(screen.getByRole('button', { name: /redeem/i })).toBeDisabled();
  });

  it('shows "Not enough coins" text when coins insufficient', () => {
    render(<RewardCard {...defaultProps} currentCoins={20} />);
    expect(screen.getByText(/not enough coins/i)).toBeInTheDocument();
  });

  // SR-55
  it('calls onDelete when delete button clicked with confirm', () => {
    window.confirm = vi.fn(() => true);
    render(<RewardCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('reward-1');
  });
});
