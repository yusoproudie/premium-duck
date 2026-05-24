import { render, screen, fireEvent } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { GoalModal } from '../GoalModal';
import type { Category } from '../../../types';

const mockCategories: Category[] = [
  { id: 'skills', name: 'Skills & Learning', emoji: '📚', section: 'head', isDefault: true },
  { id: 'health', name: 'Health & Wellness', emoji: '🌱', section: 'body', isDefault: true },
];

describe('GoalModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    categories: mockCategories,
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
    defaultProps.onSave.mockClear();
  });

  // SR-28
  it('renders name input', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders description textarea', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders category select with all options', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: /Skills & Learning/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Health & Wellness/i })).toBeInTheDocument();
  });

  it('renders period select', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: 'Monthly' })).toBeInTheDocument();
  });

  it('renders deadline input', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
  });

  it('renders repeats checkbox', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByRole('checkbox', { name: /repeats/i })).toBeInTheDocument();
  });

  // SR-29
  it('does not call onSave when name is empty', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /save goal/i }));
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  // SR-30
  it('adds sub-goal when input filled and Add button clicked', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Step...'), 'First step');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(screen.getByText('First step')).toBeInTheDocument();
  });

  it('removes sub-goal when X button clicked', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Step...'), 'First step');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    fireEvent.click(screen.getByRole('button', { name: /remove sub-goal/i }));
    expect(screen.queryByText('First step')).not.toBeInTheDocument();
  });

  it('calls onSave with goal data when form submitted with valid name', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Learn TDD');
    await user.click(screen.getByRole('button', { name: /save goal/i }));

    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Learn TDD',
        categoryId: 'skills',
      })
    );
  });

  it('resets form after successful save', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Learn TDD');
    await user.click(screen.getByRole('button', { name: /save goal/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
