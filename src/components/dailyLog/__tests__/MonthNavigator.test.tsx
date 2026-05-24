import { render, screen, fireEvent } from '../../../test-utils/render';
import { MonthNavigator } from '../MonthNavigator';

describe('MonthNavigator', () => {
  const mockDate = new Date(2026, 4, 1); // May 2026

  // SR-36
  it('renders current month and year', () => {
    render(
      <MonthNavigator
        currentDate={mockDate}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );
    expect(screen.getByText('May 2026')).toBeInTheDocument();
  });

  it('calls onPrevious when left arrow clicked', () => {
    const handlePrev = vi.fn();
    render(
      <MonthNavigator
        currentDate={mockDate}
        onPrevious={handlePrev}
        onNext={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /previous month/i }));
    expect(handlePrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when right arrow clicked', () => {
    const handleNext = vi.fn();
    render(
      <MonthNavigator
        currentDate={mockDate}
        onPrevious={vi.fn()}
        onNext={handleNext}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /next month/i }));
    expect(handleNext).toHaveBeenCalledTimes(1);
  });
});
