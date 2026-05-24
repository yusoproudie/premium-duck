import { render, screen } from '../../../test-utils/render';
import { GrowthRadarChart } from '../RadarChart';
import type { RadarDataPoint } from '../../../types';

// Mock recharts เพราะ SVG rendering ซับซ้อนใน jsdom
vi.mock('recharts', () => ({
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  Radar: () => <div data-testid="radar" />,
  PolarGrid: () => <div />,
  PolarAngleAxis: () => <div />,
  PolarRadiusAxis: () => <div />,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

const mockData: RadarDataPoint[] = [
  { category: 'Work & Career', score: 5, fullMark: 10 },
  { category: 'Skills & Learning', score: 7, fullMark: 10 },
  { category: 'Health & Wellness', score: 3, fullMark: 10 },
  { category: 'Communication', score: 6, fullMark: 10 },
  { category: 'Finance', score: 4, fullMark: 10 },
  { category: 'Relationships', score: 8, fullMark: 10 },
];

describe('GrowthRadarChart', () => {
  // SR-21
  it('renders "Growth radar" title', () => {
    render(<GrowthRadarChart data={mockData} />);
    expect(screen.getByText('Growth radar')).toBeInTheDocument();
  });

  it('renders radar chart element', () => {
    render(<GrowthRadarChart data={mockData} />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('renders scale label "0–10 scale"', () => {
    render(<GrowthRadarChart data={mockData} />);
    expect(screen.getByText('0–10 scale')).toBeInTheDocument();
  });
});
