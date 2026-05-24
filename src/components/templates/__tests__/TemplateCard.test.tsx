import { render, screen, fireEvent } from '../../../test-utils/render';
import { TemplateCard } from '../TemplateCard';
import type { TaskTemplate } from '../../../types';

const mockTemplate: TaskTemplate = {
  id: 'tmpl-1',
  name: 'Morning Workout',
  type: 'fixed',
  coins: 10,
  version: '1.0',
  createdAt: new Date(),
};

describe('TemplateCard', () => {
  const defaultProps = {
    template: mockTemplate,
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onDelete.mockClear();
  });

  // SR-49
  it('renders template name', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
  });

  it('renders coin value', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('renders type label', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText(/fixed/i)).toBeInTheDocument();
  });

  it('renders version', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText(/v1.0/i)).toBeInTheDocument();
  });

  // SR-48
  it('calls onDelete with confirm when delete button clicked', () => {
    window.confirm = vi.fn(() => true);
    render(<TemplateCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('tmpl-1');
  });

  it('does not call onDelete when confirm cancelled', () => {
    window.confirm = vi.fn(() => false);
    const handleDelete = vi.fn();
    render(<TemplateCard {...defaultProps} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).not.toHaveBeenCalled();
  });
});
