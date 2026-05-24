import { render, screen } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { DailyLogModal } from '../DailyLogModal';
import { DailyTask } from '../../../types';

const selectedDate = new Date(2026, 4, 15); // May 15

const existingTasks: DailyTask[] = [
  { id: 't1', description: 'Morning workout', coins: 5, createdAt: new Date() },
];

describe('DailyLogModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    selectedDate,
    tasks: [],
    onSaveTasks: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
    defaultProps.onSaveTasks.mockClear();
  });

  // SR-41
  it('renders modal title with selected date', () => {
    render(<DailyLogModal {...defaultProps} />);
    expect(screen.getByText(/May 15, 2026/)).toBeInTheDocument();
  });

  it('renders existing tasks', () => {
    render(<DailyLogModal {...defaultProps} tasks={existingTasks} />);
    expect(screen.getByText('Morning workout')).toBeInTheDocument();
    expect(screen.getByText('🪙 5 coins')).toBeInTheDocument();
  });

  // SR-42
  it('renders task input field', () => {
    render(<DailyLogModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('What did you do?')).toBeInTheDocument();
  });

  it('adds task when "Add task" clicked', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('What did you do?'), 'Evening walk');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Evening walk')).toBeInTheDocument();
  });

  it('removes task when trash button clicked', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} tasks={existingTasks} />);
    await user.click(screen.getByRole('button', { name: /remove task/i }));
    expect(screen.queryByText('Morning workout')).not.toBeInTheDocument();
  });

  it('displays total coins correctly after adding task', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('What did you do?'), 'Run');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('🪙 5')).toBeInTheDocument(); // default 5 coins
  });

  // SR-43
  it('calls onSaveTasks with date and tasks when Save clicked', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} tasks={existingTasks} />);
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(defaultProps.onSaveTasks).toHaveBeenCalledWith(selectedDate, existingTasks);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<DailyLogModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/May 15, 2026/)).not.toBeInTheDocument();
  });
});
