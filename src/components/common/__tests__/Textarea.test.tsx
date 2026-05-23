import { render, screen, fireEvent } from '../../../test-utils/render';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<Textarea />);
    expect(screen.queryByText(/label/i)).not.toBeInTheDocument();
  });

  it('renders error message when error prop provided', () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop provided', () => {
    render(<Textarea error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('does not show error styling when no error', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).not.toHaveClass('border-red-500');
  });

  it('calls onChange when user types', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
