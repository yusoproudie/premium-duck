import { render, screen } from '../../../test-utils/render';
import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  // SR-15
  it('renders greeting "Hello, Friend 👋"', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Hello, Friend 👋')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Dashboard" subtitle="Today's snapshot" />);
    expect(screen.getByText("Today's snapshot")).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <PageHeader title="Goals" action={<button>New Goal</button>} />
    );
    expect(screen.getByRole('button', { name: 'New Goal' })).toBeInTheDocument();
  });

  it('does not render action area when no action provided', () => {
    render(<PageHeader title="Goals" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
