import { render, screen, fireEvent } from '../../../test-utils/render';
import { Button } from '../Button';

describe('Button', () => {
  describe('variants', () => {
    it('renders primary variant with yellow background class', () => {
      render(<Button variant="primary">Click</Button>);
      expect(screen.getByRole('button', { name: 'Click' })).toHaveClass('bg-cozy-yellow');
    });

    it('renders secondary variant with blue background class', () => {
      render(<Button variant="secondary">Click</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-cozy-blue');
    });

    it('renders danger variant with red border', () => {
      render(<Button variant="danger">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('border-red-500');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-cozy-text-secondary');
    });

    it('defaults to primary variant when no variant specified', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-cozy-yellow');
    });
  });

  describe('sizes', () => {
    it('renders sm size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-3');
    });

    it('renders md size by default', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-4');
    });

    it('renders lg size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-6');
    });

    it('renders fullWidth when prop is true', () => {
      render(<Button fullWidth>Full</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is passed', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders children correctly', () => {
    render(<Button>Hello World</Button>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
