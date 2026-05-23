# Sprint 03 — Dashboard Page
> ISO 29110 Phase: **Software Implementation — Construction + Integration** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 3–4 วัน |
| Sprint Goal | สร้าง Dashboard ที่ fully functional: StatsCard, RadarChart, QuickAdd |
| Depends On | Sprint 02 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/03-dashboard` |

---

## ISO 29110 — Software Requirements (SI.1)

| ID | Requirement | Priority |
|---|---|---|
| SR-18 | Dashboard แสดง 4 StatsCards: Total Coins, HEAD, BODY, FEET | Must |
| SR-19 | Total Coins card มี blue border (primary variant) | Must |
| SR-20 | HEAD/BODY/FEET score แสดงเป็น `0.0/10` format | Must |
| SR-21 | Radar Chart แสดง 6 categories บน hexagonal grid | Must |
| SR-22 | QuickAdd form รับ task description + coins value | Must |
| SR-23 | QuickAdd "Log it" button เรียก callback พร้อม task + coins | Must |
| SR-24 | "Upcoming goals" section แสดง empty state เมื่อไม่มี goals | Must |
| SR-25 | StatsCard negative coins ต้องไม่แสดงสีแดง (แค่ total bar) | Must |

---

## TDD Cycle — Sprint 03

### Step 1: StatsCard — RED → GREEN → REFACTOR

สร้าง `src/components/dashboard/__tests__/StatsCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  // SR-18
  it('renders label', () => {
    render(<StatsCard label="Total coins" value={100} />);
    expect(screen.getByText('Total coins')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatsCard label="HEAD" value={7.5} />);
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatsCard label="HEAD" value="0.0" />);
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  // SR-20
  it('renders maxValue with slash when provided', () => {
    render(<StatsCard label="HEAD" value="0.0" maxValue={10} />);
    expect(screen.getByText('/10')).toBeInTheDocument();
  });

  it('does not render maxValue when not provided', () => {
    render(<StatsCard label="HEAD" value={100} />);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  // SR-19
  it('applies primary variant border styling', () => {
    const { container } = render(
      <StatsCard label="Total coins" value={100} variant="primary" />
    );
    expect(container.firstChild).toHaveClass('border-cozy-blue');
  });

  it('does not apply primary border for default variant', () => {
    const { container } = render(
      <StatsCard label="HEAD" value="0.0" />
    );
    expect(container.firstChild).not.toHaveClass('border-cozy-blue');
  });

  it('shows "Keep collecting daily" text for primary variant', () => {
    render(<StatsCard label="Total coins" value={100} variant="primary" />);
    expect(screen.getByText('Keep collecting daily')).toBeInTheDocument();
  });

  it('does not show "Keep collecting daily" for default variant', () => {
    render(<StatsCard label="HEAD" value="0.0" />);
    expect(screen.queryByText('Keep collecting daily')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked and onClick provided', () => {
    const handleClick = jest.fn();
    render(<StatsCard label="HEAD" value="0.0" onClick={handleClick} />);
    fireEvent.click(screen.getByText('HEAD').closest('div')!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

### Step 2: QuickAdd — RED → GREEN → REFACTOR

สร้าง `src/components/dashboard/__tests__/QuickAdd.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { QuickAdd } from '../QuickAdd';

describe('QuickAdd', () => {
  const mockOnAddTask = jest.fn();

  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  // SR-22
  it('renders task input field', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByPlaceholderText('What did you do?')).toBeInTheDocument();
  });

  it('renders coins input field with default value 5', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('renders "Log it" button', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByRole('button', { name: /log it/i })).toBeInTheDocument();
  });

  // SR-23
  it('calls onAddTask with task description and coins when submitted', async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAddTask={mockOnAddTask} />);

    await user.type(screen.getByPlaceholderText('What did you do?'), 'Morning run');
    await user.clear(screen.getByDisplayValue('5'));
    await user.type(screen.getByDisplayValue(''), '10');
    await user.click(screen.getByRole('button', { name: /log it/i }));

    expect(mockOnAddTask).toHaveBeenCalledWith('Morning run', 10);
  });

  it('does not call onAddTask when task is empty', async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAddTask={mockOnAddTask} />);

    await user.click(screen.getByRole('button', { name: /log it/i }));

    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('resets input fields after successful submission', async () => {
    const user = userEvent.setup();
    render(<QuickAdd onAddTask={mockOnAddTask} />);

    await user.type(screen.getByPlaceholderText('What did you do?'), 'Morning run');
    await user.click(screen.getByRole('button', { name: /log it/i }));

    expect(screen.getByPlaceholderText('What did you do?')).toHaveValue('');
    expect(screen.getByDisplayValue('5')).toBeInTheDocument(); // reset to 5
  });

  // SR-24
  it('renders "Upcoming goals" section', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByText('Upcoming goals')).toBeInTheDocument();
  });

  it('shows empty state text when no goals', () => {
    render(<QuickAdd onAddTask={mockOnAddTask} />);
    expect(screen.getByText('No goals yet.')).toBeInTheDocument();
  });
});
```

---

### Step 3: RadarChart — RED → GREEN → REFACTOR

สร้าง `src/components/dashboard/__tests__/RadarChart.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { GrowthRadarChart } from '../RadarChart';
import { RadarDataPoint } from '../../../types';

// Mock recharts เพราะ SVG rendering ซับซ้อนใน jsdom
jest.mock('recharts', () => ({
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
```

> **ทำไม mock recharts:** recharts ใช้ SVG + ResizeObserver ซึ่ง jsdom รองรับไม่สมบูรณ์
> Mock แค่สำหรับ unit test — integration/visual ทดสอบด้วย browser จริง

---

### Step 4: Dashboard Page Integration

สร้าง `src/pages/__tests__/Dashboard.test.tsx`

```typescript
import { render, screen } from '../../test-utils/render';
import Dashboard from '../Dashboard';

// Mock recharts ป้องกัน SVG error ใน jsdom
jest.mock('recharts', () => ({
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
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/components/dashboard/StatsCard.tsx` + test ผ่าน
- [ ] `src/components/dashboard/RadarChart.tsx` + test ผ่าน
- [ ] `src/components/dashboard/QuickAdd.tsx` + test ผ่าน
- [ ] `src/pages/Dashboard.tsx` (fully implemented) + test ผ่าน

---

## Definition of Done (DoD) — Sprint 03

- [ ] `npm test` — ทุก test GREEN (Sprint 01 + 02 + 03)
- [ ] Dashboard render ใน browser ครบทุก element
- [ ] QuickAdd: กรอก task + click "Log it" → alert หรือ callback ทำงาน
- [ ] Radar Chart แสดง hexagonal grid (visual verify ใน browser)
- [ ] TypeScript ไม่มี error
- [ ] PR merged → main ผ่าน CI

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-18 | Dashboard.test.tsx | renders 4 stats cards |
| SR-19 | StatsCard.test.tsx | applies primary variant border |
| SR-20 | StatsCard.test.tsx | renders maxValue with slash |
| SR-21 | RadarChart.test.tsx | renders radar chart element |
| SR-22 | QuickAdd.test.tsx | renders task input + coins input |
| SR-23 | QuickAdd.test.tsx | calls onAddTask with correct args |
| SR-24 | QuickAdd.test.tsx | shows empty state text |
| SR-25 | StatsCard.test.tsx | does not apply red for negative value |
