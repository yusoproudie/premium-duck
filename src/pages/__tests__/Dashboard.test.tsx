import { render, screen } from '../../test-utils/render';
import Dashboard from '../Dashboard';

// Mock recharts ป้องกัน SVG error ใน jsdom
vi.mock('recharts', () => ({
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

describe('Dashboard Page', () => {
  it('renders page heading', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  // SR-18
  it('renders 4 stats cards', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total coins')).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
    expect(screen.getByText('BODY')).toBeInTheDocument();
    expect(screen.getByText('FEET')).toBeInTheDocument();
  });

  // SR-22
  it('renders QuickAdd widget', () => {
    render(<Dashboard />);
    expect(screen.getByPlaceholderText('What did you do?')).toBeInTheDocument();
  });

  // SR-21
  it('renders radar chart', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });
});
