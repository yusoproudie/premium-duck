import { render, screen } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { QuickAdd } from '../QuickAdd';

describe('QuickAdd', () => {
  const mockOnAddTask = vi.fn();

  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  // SR-22
  it('renders task input field', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByPlaceholderText('What did you do?')).toBeInTheDocument();
  });

  it('renders coins input field with default value 5', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('renders "Log it" button', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByRole('button', { name: /log it/i })).toBeInTheDocument();
  });

  // SR-23
  it('calls onAddTask with task description and coins when submitted', async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAddTask={mockOnAddTask} />);

    await user.type(screen.getByPlaceholderText('What did you do?'), 'Morning run');
    await user.clear(screen.getByDisplayValue('5'));
    await user.type(screen.getByDisplayValue(''), '10');
    await user.click(screen.getByRole('button', { name: /log it/i }));

    expect(mockOnAddTask).toHaveBeenCalledWith('Morning run', 10);
  });

  it('does not call onAddTask when task is empty', async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAddTask={mockOnAddTask} />);

    await user.click(screen.getByRole('button', { name: /log it/i }));

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('resets input fields after successful submission', async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAddTask={mockOnAddTask} />);

    await user.type(screen.getByPlaceholderText('What did you do?'), 'Morning run');
    await user.click(screen.getByRole('button', { name: /log it/i }));

    expect(screen.getByPlaceholderText('What did you do?')).toHaveValue('');
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  // SR-24
  it('renders "Upcoming goals" section', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByText('Upcoming goals')).toBeInTheDocument();
  });

  it('shows empty state text when no goals', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByText('No goals yet.')).toBeInTheDocument();
  });
});
