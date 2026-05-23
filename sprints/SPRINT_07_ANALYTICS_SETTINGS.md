# Sprint 07 — Analytics + Settings Pages
> ISO 29110 Phase: **Software Implementation — Construction + Integration** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 3–4 วัน |
| Sprint Goal | Analytics (charts + stats) + Settings (profile + categories + reset) |
| Depends On | Sprint 06 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/07-analytics-settings` |

---

## ISO 29110 — Software Requirements (SI.1)

### Analytics Requirements

| ID | Requirement | Priority |
|---|---|---|
| SR-56 | Analytics แสดง summary cards: total coins, avg coins/day, best day, total days logged | Must |
| SR-57 | Line chart แสดง coins over time (weekly/monthly) | Must |
| SR-58 | Toggle weekly/monthly view สำหรับ chart | Must |
| SR-59 | Bar chart แสดง coins per category | Should |
| SR-60 | Export data เป็น CSV | Should |

### Settings Requirements

| ID | Requirement | Priority |
|---|---|---|
| SR-61 | แก้ไข user profile name | Must |
| SR-62 | จัดการ categories: เพิ่ม/ลบ/แก้ emoji + section | Must |
| SR-63 | Default categories ลบไม่ได้ | Must |
| SR-64 | Reset data ทั้งหมด (พร้อม double-confirm) | Must |

---

## TDD Cycle — Sprint 07

### Analytics Utils — ทดสอบ calculation logic ก่อน

สร้าง `src/utils/__tests__/analytics.test.ts`

```typescript
import {
  calculateTotalCoins,
  calculateAverageCoinsPerDay,
  findBestDay,
  groupCoinsByWeek,
  groupCoinsByMonth,
  groupCoinsByCategory,
} from '../analytics';
import { DailyLogEntry } from '../../types';

const mockEntries: DailyLogEntry[] = [
  {
    id: '1',
    date: new Date(2026, 4, 1),
    tasks: [{ id: 't1', description: 'A', coins: 10, createdAt: new Date() }],
    totalCoins: 10,
    hasPenalty: false,
  },
  {
    id: '2',
    date: new Date(2026, 4, 2),
    tasks: [{ id: 't2', description: 'B', coins: 20, createdAt: new Date() }],
    totalCoins: 20,
    hasPenalty: false,
  },
  {
    id: '3',
    date: new Date(2026, 4, 3),
    tasks: [],
    totalCoins: -10,
    hasPenalty: true,
  },
];

describe('calculateTotalCoins', () => {
  // SR-56
  it('returns sum of all entry coins', () => {
    expect(calculateTotalCoins(mockEntries)).toBe(20); // 10 + 20 - 10
  });

  it('returns 0 for empty entries', () => {
    expect(calculateTotalCoins([])).toBe(0);
  });
});

describe('calculateAverageCoinsPerDay', () => {
  // SR-56
  it('returns average per day (excluding penalty days)', () => {
    // วันที่มี positive coins: 10, 20 → avg = 15
    expect(calculateAverageCoinsPerDay(mockEntries)).toBe(15);
  });

  it('returns 0 for empty entries', () => {
    expect(calculateAverageCoinsPerDay([])).toBe(0);
  });
});

describe('findBestDay', () => {
  // SR-56
  it('returns entry with highest coins', () => {
    const best = findBestDay(mockEntries);
    expect(best?.totalCoins).toBe(20);
  });

  it('returns null for empty entries', () => {
    expect(findBestDay([])).toBeNull();
  });
});

describe('groupCoinsByWeek', () => {
  // SR-57, SR-58
  it('groups entries by week and sums coins', () => {
    const result = groupCoinsByWeek(mockEntries);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('label');
    expect(result[0]).toHaveProperty('coins');
  });
});
```

สร้าง `src/utils/analytics.ts`:

```typescript
import { DailyLogEntry } from '../types';
import { format, startOfWeek, startOfMonth } from 'date-fns';

export const calculateTotalCoins = (entries: DailyLogEntry[]): number =>
  entries.reduce((sum, e) => sum + e.totalCoins, 0);

export const calculateAverageCoinsPerDay = (entries: DailyLogEntry[]): number => {
  const positiveDays = entries.filter(e => !e.hasPenalty);
  if (positiveDays.length === 0) return 0;
  return Math.round(
    positiveDays.reduce((sum, e) => sum + e.totalCoins, 0) / positiveDays.length
  );
};

export const findBestDay = (entries: DailyLogEntry[]): DailyLogEntry | null => {
  if (entries.length === 0) return null;
  return entries.reduce((best, e) => (e.totalCoins > best.totalCoins ? e : best));
};

export const groupCoinsByWeek = (entries: DailyLogEntry[]) => {
  const groups: Record<string, number> = {};
  entries.forEach(entry => {
    const weekStart = format(startOfWeek(new Date(entry.date)), 'MMM d');
    groups[weekStart] = (groups[weekStart] || 0) + entry.totalCoins;
  });
  return Object.entries(groups).map(([label, coins]) => ({ label, coins }));
};

export const groupCoinsByMonth = (entries: DailyLogEntry[]) => {
  const groups: Record<string, number> = {};
  entries.forEach(entry => {
    const month = format(startOfMonth(new Date(entry.date)), 'MMM yyyy');
    groups[month] = (groups[month] || 0) + entry.totalCoins;
  });
  return Object.entries(groups).map(([label, coins]) => ({ label, coins }));
};

export const groupCoinsByCategory = (entries: DailyLogEntry[]) => {
  const groups: Record<string, number> = {};
  entries.forEach(entry => {
    entry.tasks.forEach(task => {
      const key = task.categoryId || 'uncategorized';
      groups[key] = (groups[key] || 0) + task.coins;
    });
  });
  return Object.entries(groups).map(([categoryId, coins]) => ({ categoryId, coins }));
};
```

---

### Analytics Components

สร้าง `src/components/analytics/__tests__/AnalyticsSummary.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { AnalyticsSummary } from '../AnalyticsSummary';

describe('AnalyticsSummary', () => {
  const defaultProps = {
    totalCoins: 250,
    averageCoinsPerDay: 15,
    bestDay: 30,
    totalDaysLogged: 20,
  };

  // SR-56
  it('renders total coins', () => {
    render(<AnalyticsSummary {...defaultProps} />);
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText(/total coins/i)).toBeInTheDocument();
  });

  it('renders average coins per day', () => {
    render(<AnalyticsSummary {...defaultProps} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText(/avg.*day/i)).toBeInTheDocument();
  });

  it('renders best day coins', () => {
    render(<AnalyticsSummary {...defaultProps} />);
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText(/best day/i)).toBeInTheDocument();
  });

  it('renders total days logged', () => {
    render(<AnalyticsSummary {...defaultProps} />);
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText(/days logged/i)).toBeInTheDocument();
  });
});
```

สร้าง `src/components/analytics/__tests__/ChartToggle.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { ChartToggle } from '../ChartToggle';

describe('ChartToggle', () => {
  // SR-58
  it('renders Weekly and Monthly options', () => {
    render(<ChartToggle view="weekly" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: /weekly/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /monthly/i })).toBeInTheDocument();
  });

  it('highlights active view', () => {
    render(<ChartToggle view="weekly" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: /weekly/i })).toHaveClass('bg-cozy-yellow');
    expect(screen.getByRole('button', { name: /monthly/i })).not.toHaveClass('bg-cozy-yellow');
  });

  it('calls onChange with "monthly" when Monthly clicked', () => {
    const handleChange = jest.fn();
    render(<ChartToggle view="weekly" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /monthly/i }));
    expect(handleChange).toHaveBeenCalledWith('monthly');
  });
});
```

---

### Settings Components

สร้าง `src/components/settings/__tests__/ProfileForm.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from '../ProfileForm';

describe('ProfileForm', () => {
  // SR-61
  it('renders name input with current value', () => {
    render(<ProfileForm currentName="Proudie" onSave={jest.fn()} />);
    expect(screen.getByDisplayValue('Proudie')).toBeInTheDocument();
  });

  it('calls onSave with new name when form submitted', async () => {
    const user = userEvent.setup();
    const handleSave = jest.fn();
    render(<ProfileForm currentName="Proudie" onSave={handleSave} />);
    const input = screen.getByDisplayValue('Proudie');
    await user.clear(input);
    await user.type(input, 'Punyanuch');
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(handleSave).toHaveBeenCalledWith('Punyanuch');
  });

  it('does not save when name is empty', async () => {
    const user = userEvent.setup();
    const handleSave = jest.fn();
    render(<ProfileForm currentName="Proudie" onSave={handleSave} />);
    await user.clear(screen.getByDisplayValue('Proudie'));
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(handleSave).not.toHaveBeenCalled();
  });
});
```

สร้าง `src/components/settings/__tests__/CategoryManager.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { CategoryManager } from '../CategoryManager';
import { Category } from '../../../types';

const defaultCategories: Category[] = [
  { id: 'work', name: 'Work & Career', emoji: '💼', section: 'head', isDefault: true },
  { id: 'custom', name: 'Custom Cat', emoji: '⭐', section: 'body', isDefault: false },
];

describe('CategoryManager', () => {
  const defaultProps = {
    categories: defaultCategories,
    onAddCategory: jest.fn(),
    onDeleteCategory: jest.fn(),
  };

  // SR-62
  it('renders all categories', () => {
    render(<CategoryManager {...defaultProps} />);
    expect(screen.getByText('Work & Career')).toBeInTheDocument();
    expect(screen.getByText('Custom Cat')).toBeInTheDocument();
  });

  // SR-63
  it('does not show delete button for default categories', () => {
    render(<CategoryManager {...defaultProps} />);
    const workRow = screen.getByText('Work & Career').closest('div');
    // delete button ไม่ควรอยู่ใน default category row
    expect(workRow?.querySelector('[data-testid="delete-category"]')).not.toBeInTheDocument();
  });

  it('shows delete button for custom categories', () => {
    render(<CategoryManager {...defaultProps} />);
    const customRow = screen.getByText('Custom Cat').closest('div');
    expect(customRow?.querySelector('[data-testid="delete-category"]')).toBeInTheDocument();
  });

  it('calls onDeleteCategory when delete clicked for custom category', () => {
    window.confirm = jest.fn(() => true);
    render(<CategoryManager {...defaultProps} />);
    const deleteButtons = screen.getAllByTestId('delete-category');
    fireEvent.click(deleteButtons[0]);
    expect(defaultProps.onDeleteCategory).toHaveBeenCalledWith('custom');
  });

  // SR-64 — Reset Data
  it('shows reset data button', () => {
    render(<CategoryManager {...defaultProps} />);
    // Reset อยู่ใน Settings page ไม่ใช่ CategoryManager — ข้ามไป Settings.test.tsx
  });
});
```

สร้าง `src/pages/__tests__/Settings.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../test-utils/render';
import userEvent from '@testing-library/user-event';
import Settings from '../Settings';

describe('Settings Page', () => {
  // SR-64
  it('renders reset data button', () => {
    render(<Settings />);
    expect(screen.getByRole('button', { name: /reset.*data/i })).toBeInTheDocument();
  });

  it('does NOT reset immediately — shows confirmation first', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false); // user cancel
    render(<Settings />);
    await user.click(screen.getByRole('button', { name: /reset.*data/i }));
    // ถ้า confirm cancel → ไม่ทำอะไร
    expect(window.confirm).toHaveBeenCalledTimes(1);
  });
});
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/utils/analytics.ts` + test ผ่าน
- [ ] `src/components/analytics/AnalyticsSummary.tsx` + test ผ่าน
- [ ] `src/components/analytics/ChartToggle.tsx` + test ผ่าน
- [ ] `src/components/analytics/CoinsLineChart.tsx` (mock recharts)
- [ ] `src/components/settings/ProfileForm.tsx` + test ผ่าน
- [ ] `src/components/settings/CategoryManager.tsx` + test ผ่าน
- [ ] `src/pages/Analytics.tsx` (fully implemented)
- [ ] `src/pages/Settings.tsx` (fully implemented)

---

## Definition of Done (DoD) — Sprint 07

- [ ] `npm test` — ทุก test GREEN (Sprint 01–07)
- [ ] Analytics summary cards แสดงค่าจาก mock data
- [ ] Toggle weekly/monthly เปลี่ยน chart data
- [ ] Settings: แก้ชื่อได้, เพิ่ม custom category ได้
- [ ] Default category ลบไม่ได้ (ปุ่มไม่มี)
- [ ] Reset data → confirm dialog ก่อน
- [ ] PR merged → main ผ่าน CI
