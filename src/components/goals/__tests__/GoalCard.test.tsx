import { render, screen, fireEvent } from '../../../test-utils/render';
import { GoalCard } from '../GoalCard';
import type { Goal, Category } from '../../../types';

const mockCategory: Category = {
  id: 'skills',
  name: 'Skills & Learning',
  emoji: '📚',
  section: 'head',
  isDefault: true,
};

const mockGoal: Goal = {
  id: 'goal-1',
  name: 'Learn React Testing',
  description: 'Master RTL and Jest',
  categoryId: 'skills',
  period: 'monthly',
  deadline: new Date('2026-06-30'),
  repeats: false,
  subGoals: [
    { id: 'sg-1', text: 'Read docs', completed: true },
    { id: 'sg-2', text: 'Build project', completed: false },
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GoalCard', () => {
  const defaultProps = {
    goal: mockGoal,
    category: mockCategory,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  // SR-31
  it('renders goal name', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('Learn React Testing')).toBeInTheDocument();
  });

  it('renders category emoji', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('renders period', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
  });

  it('renders deadline when provided', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText(/Jun 30, 2026/)).toBeInTheDocument();
  });

  it('does not render deadline when not provided', () => {
    const goalWithoutDeadline = { ...mockGoal, deadline: undefined };
    render(<GoalCard {...defaultProps} goal={goalWithoutDeadline} />);
    expect(screen.queryByText(/Due/)).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('Master RTL and Jest')).toBeInTheDocument();
  });

  // SR-32
  it('renders progress bar when sub-goals exist', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('does not render progress section when no sub-goals', () => {
    const goalNoSubGoals = { ...mockGoal, subGoals: [] };
    render(<GoalCard {...defaultProps} goal={goalNoSubGoals} />);
    expect(screen.queryByText(/Progress/)).not.toBeInTheDocument();
  });

  // SR-33
  it('calls onDelete when delete button clicked', () => {
    const handleDelete = vi.fn();
    window.confirm = vi.fn(() => true);
    render(<GoalCard {...defaultProps} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith('goal-1');
  });

  it('does not call onDelete when confirm is cancelled', () => {
    const handleDelete = vi.fn();
    window.confirm = vi.fn(() => false);
    render(<GoalCard {...defaultProps} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).not.toHaveBeenCalled();
  });

  it('calls onEdit when edit button clicked', () => {
    const handleEdit = vi.fn();
    render(<GoalCard {...defaultProps} onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(mockGoal);
  });
});
