import { render, screen } from '../../../test-utils/render';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  // SR-11
  it('renders all 7 navigation items', () => {
    render(<Sidebar totalCoins={0} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Daily Log')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Rewards')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders app brand name "Premium Duck"', () => {
    render(<Sidebar totalCoins={0} />);
    expect(screen.getByText('Premium Duck')).toBeInTheDocument();
  });

  it('renders CoinCounter with correct coins value', () => {
    render(<Sidebar totalCoins={250} />);
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Sidebar totalCoins={0} />);
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Goals/i })).toHaveAttribute('href', '/goals');
    expect(screen.getByRole('link', { name: /Daily Log/i })).toHaveAttribute('href', '/daily-log');
  });
});
