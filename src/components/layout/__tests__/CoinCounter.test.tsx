import { render, screen } from '../../../test-utils/render';
import { CoinCounter } from '../CoinCounter';

describe('CoinCounter', () => {
  // SR-13
  it('displays coin value', () => {
    render(<CoinCounter coins={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays "coins" label', () => {
    render(<CoinCounter coins={100} />);
    expect(screen.getByText('coins')).toBeInTheDocument();
  });

  it('applies red text when coins are negative', () => {
    render(<CoinCounter coins={-50} />);
    const coinValue = screen.getByText('-50');
    expect(coinValue).toHaveClass('text-red-500');
  });

  it('does not apply red text when coins are positive', () => {
    render(<CoinCounter coins={100} />);
    const coinValue = screen.getByText('100');
    expect(coinValue).not.toHaveClass('text-red-500');
  });

  it('does not apply red text when coins are zero', () => {
    render(<CoinCounter coins={0} />);
    const coinValue = screen.getByText('0');
    expect(coinValue).not.toHaveClass('text-red-500');
  });
});
