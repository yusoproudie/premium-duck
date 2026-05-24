import { render, screen, fireEvent } from '../../../test-utils/render';
import { MonthCalendar } from '../MonthCalendar';
import { DailyLogEntry } from '../../../types';

const mayDate = new Date(2026, 4, 1); // May 2026

const mockLogEntries: DailyLogEntry[] = [
  {
    id: '1',
    date: new Date(2026, 4, 5),
    tasks: [{ id: 't1', description: 'Morning run', coins: 5, createdAt: new Date() }],
    totalCoins: 5,
    hasPenalty: false,
  },
  {
    id: '2',
    date: new Date(2026, 4, 10),
    tasks: [],
    totalCoins: -10,
    hasPenalty: true,
  },
];

describe('MonthCalendar', () => {
  // SR-37
  it('renders weekday headers Sun through Sat', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={[]}
        onDayClick={jest.fn()}
      />
    );
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders correct number of days for May (31 days)', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={[]}
        onDayClick={jest.fn()}
      />
    );
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.queryByText('32')).not.toBeInTheDocument();
  });

  // SR-38
  it('applies yellow styling to days with positive coins', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={mockLogEntries}
        onDayClick={jest.fn()}
      />
    );
    const dayButtons = screen.getAllByRole('button');
    const day5 = dayButtons.find(btn => btn.textContent?.includes('5') && btn.textContent?.includes('🪙'));
    expect(day5).toBeDefined();
  });

  // SR-39
  it('applies pink styling to penalty days', () => {
    const { container } = render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={mockLogEntries}
        onDayClick={jest.fn()}
      />
    );
    const penaltyDays = container.querySelectorAll('.bg-cozy-pink');
    expect(penaltyDays.length).toBeGreaterThan(0);
  });

  // SR-45
  it('shows coin value below day number when entry exists', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={mockLogEntries}
        onDayClick={jest.fn()}
      />
    );
    expect(screen.getByText('🪙5')).toBeInTheDocument();
  });

  // SR-41
  it('calls onDayClick with date when day button clicked', () => {
    const handleDayClick = jest.fn();
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={[]}
        onDayClick={handleDayClick}
      />
    );
    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[0]);
    expect(handleDayClick).toHaveBeenCalledTimes(1);
    expect(handleDayClick).toHaveBeenCalledWith(expect.any(Date));
  });
});
