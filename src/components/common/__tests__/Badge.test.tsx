import { render, screen } from '../../../test-utils/render';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>HEAD</Badge>);
    expect(screen.getByText('HEAD')).toBeInTheDocument();
  });

  it('applies head variant styles', () => {
    render(<Badge variant="head">Work</Badge>);
    expect(screen.getByText('Work')).toHaveClass('bg-pink-100');
  });

  it('applies body variant styles', () => {
    render(<Badge variant="body">Health</Badge>);
    expect(screen.getByText('Health')).toHaveClass('bg-yellow-100');
  });

  it('applies feet variant styles', () => {
    render(<Badge variant="feet">Finance</Badge>);
    expect(screen.getByText('Finance')).toHaveClass('bg-blue-100');
  });

  it('defaults to default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-gray-100');
  });
});
