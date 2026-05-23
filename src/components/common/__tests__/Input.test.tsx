import { render, screen, fireEvent } from '../../../test-utils/render';
import { Input } from '../Input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<Input />);
    expect(screen.queryByText(/label/i)).not.toBeInTheDocument();
  });

  it('renders error message when error prop provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop provided', () => {
    render(<Input error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('does not show error styling when no error', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).not.toHaveClass('border-red-500');
  });

  it('passes value and onChange to input element', () => {
    const handleChange = vi.fn();
    render(<Input value="test" onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });

  it('calls onChange when user types', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('passes placeholder to input', () => {
    render(<Input placeholder="Type here..." />);
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
  });
});
