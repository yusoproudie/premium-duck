import { render, screen, fireEvent } from '../../../test-utils/render';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="No goals yet" />);
    expect(screen.getByText('No goals yet')).toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState message="Empty" actionLabel="Create one" onAction={handleAction} />
    );
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });

  it('does not render action button when no actionLabel', () => {
    render(<EmptyState message="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onAction when action button clicked', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState message="Empty" actionLabel="Add" onAction={handleAction} />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
