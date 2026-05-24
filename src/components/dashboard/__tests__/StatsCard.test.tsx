import { render, screen, fireEvent } from '../../../test-utils/render';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  // SR-18
  it('renders label', () => {
    render(<StatsCard label="Total coins" value={100} />);
    expect(screen.getByText('Total coins')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatsCard label="HEAD" value={7.5} />);
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatsCard label="HEAD" value="0.0" />);
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  // SR-20
  it('renders maxValue with slash when provided', () => {
    render(<StatsCard label="HEAD" value="0.0" maxValue={10} />);
    expect(screen.getByText('/10')).toBeInTheDocument();
  });

  it('does not render maxValue when not provided', () => {
    render(<StatsCard label="HEAD" value={100} />);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  // SR-19
  it('applies primary variant border styling', () => {
    const { container } = render(
      <StatsCard label="Total coins" value={100} variant="primary" />
    );
    expect(container.firstChild).toHaveClass('border-cozy-blue');
  });

  it('does not apply primary border for default variant', () => {
    const { container } = render(
      <StatsCard label="HEAD" value="0.0" />
    );
    expect(container.firstChild).not.toHaveClass('border-cozy-blue');
  });

  it('shows "Keep collecting daily" text for primary variant', () => {
    render(<StatsCard label="Total coins" value={100} variant="primary" />);
    expect(screen.getByText('Keep collecting daily')).toBeInTheDocument();
  });

  it('does not show "Keep collecting daily" for default variant', () => {
    render(<StatsCard label="HEAD" value="0.0" />);
    expect(screen.queryByText('Keep collecting daily')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked and onClick provided', () => {
    const handleClick = vi.fn();
    render(<StatsCard label="HEAD" value="0.0" onClick={handleClick} />);
    fireEvent.click(screen.getByText('HEAD').closest('div')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
