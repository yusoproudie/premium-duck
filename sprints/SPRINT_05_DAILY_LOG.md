# Sprint 05 — Daily Log Calendar
> ISO 29110 Phase: **Software Implementation — Construction + Integration** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 4–5 วัน |
| Sprint Goal | Daily Log Calendar ที่ fully functional — click วัน, บันทึก tasks, เห็น color status |
| Depends On | Sprint 04 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/05-daily-log` |

---

## ISO 29110 — Software Requirements (SI.1)

| ID | Requirement | Priority |
|---|---|---|
| SR-36 | MonthNavigator แสดงชื่อเดือน/ปี + ปุ่มเลื่อน prev/next | Must |
| SR-37 | MonthCalendar แสดงตาราง 7 คอลัมน์ (Sun–Sat) ถูกต้องตามเดือนจริง | Must |
| SR-38 | วันที่มี tasks → สีเหลือง (positive coins) | Must |
| SR-39 | วันที่ไม่ได้บันทึก (penalty) → สีชมพู | Must |
| SR-40 | วันนี้ → ring สีน้ำเงิน | Must |
| SR-41 | Click วัน → DailyLogModal เปิด พร้อม tasks ของวันนั้น (ถ้ามี) | Must |
| SR-42 | DailyLogModal รับ task description + coins, เพิ่ม/ลบ tasks | Must |
| SR-43 | Save → calendar อัปเดต สีวันเปลี่ยนตาม tasks ที่บันทึก | Must |
| SR-44 | วันที่ save tasks เป็น 0 → penalty (-10 coins) | Must |
| SR-45 | coins แต่ละวันแสดงใต้ตัวเลขวัน | Must |

---

## TDD Cycle — Sprint 05

### Step 1: MonthNavigator — RED → GREEN → REFACTOR

สร้าง `src/components/dailyLog/__tests__/MonthNavigator.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { MonthNavigator } from '../MonthNavigator';

describe('MonthNavigator', () => {
  const mockDate = new Date(2026, 4, 1); // May 2026

  // SR-36
  it('renders current month and year', () => {
    render(
      <MonthNavigator
        currentDate={mockDate}
        onPrevious={jest.fn()}
        onNext={jest.fn()}
      />
    );
    expect(screen.getByText('May 2026')).toBeInTheDocument();
  });

  it('calls onPrevious when left arrow clicked', () => {
    const handlePrev = jest.fn();
    render(
      <MonthNavigator
        currentDate={mockDate}
        onPrevious={handlePrev}
        onNext={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /previous month/i }));
    expect(handlePrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when right arrow clicked', () => {
    const handleNext = jest.fn();
    render(
      <MonthNavigator
        currentDate={mockDate}
        onPrevious={jest.fn()}
        onNext={handleNext}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /next month/i }));
    expect(handleNext).toHaveBeenCalledTimes(1);
  });
});
```

> **หมายเหตุ:** เพิ่ม `aria-label="Previous month"` และ `aria-label="Next month"` ใน button ของ MonthNavigator — ช่วยทั้ง test และ accessibility

---

### Step 2: MonthCalendar — RED → GREEN → REFACTOR

สร้าง `src/components/dailyLog/__tests__/MonthCalendar.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { MonthCalendar } from '../MonthCalendar';
import { DailyLogEntry } from '../../../types';

const mayDate = new Date(2026, 4, 1); // May 2026

const mockLogEntries: DailyLogEntry[] = [
  {
    id: '1',
    date: new Date(2026, 4, 5),
    tasks: [{ id: 't1', description: 'Morning run', coins: 5, createdAt: new Date() }],
    totalCoins: 5,
    hasPenalty: false,
  },
  {
    id: '2',
    date: new Date(2026, 4, 10),
    tasks: [],
    totalCoins: -10,
    hasPenalty: true,
  },
];

describe('MonthCalendar', () => {
  // SR-37
  it('renders weekday headers Sun through Sat', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={[]}
        onDayClick={jest.fn()}
      />
    );
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders correct number of days for May (31 days)', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={[]}
        onDayClick={jest.fn()}
      />
    );
    // May มี 31 วัน — เลข 31 ต้องอยู่ใน calendar
    expect(screen.getByText('31')).toBeInTheDocument();
    // เดือนนี้ไม่มีวันที่ 32
    expect(screen.queryByText('32')).not.toBeInTheDocument();
  });

  // SR-38
  it('applies yellow styling to days with positive coins', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={mockLogEntries}
        onDayClick={jest.fn()}
      />
    );
    // วันที่ 5 มี coins 5 → ควรมี yellow class
    const dayButtons = screen.getAllByRole('button');
    const day5 = dayButtons.find(btn => btn.textContent?.includes('5') && btn.textContent?.includes('🪙'));
    expect(day5).toBeDefined();
  });

  // SR-39
  it('applies pink styling to penalty days', () => {
    const { container } = render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={mockLogEntries}
        onDayClick={jest.fn()}
      />
    );
    // วันที่ 10 มี penalty → bg-cozy-pink
    const penaltyDays = container.querySelectorAll('.bg-cozy-pink');
    expect(penaltyDays.length).toBeGreaterThan(0);
  });

  // SR-45
  it('shows coin value below day number when entry exists', () => {
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={mockLogEntries}
        onDayClick={jest.fn()}
      />
    );
    expect(screen.getByText('🪙5')).toBeInTheDocument();
  });

  // SR-41
  it('calls onDayClick with date when day button clicked', () => {
    const handleDayClick = jest.fn();
    render(
      <MonthCalendar
        currentDate={mayDate}
        logEntries={[]}
        onDayClick={handleDayClick}
      />
    );
    const dayButtons = screen.getAllByRole('button');
    fireEvent.click(dayButtons[0]); // first day button
    expect(handleDayClick).toHaveBeenCalledTimes(1);
    expect(handleDayClick).toHaveBeenCalledWith(expect.any(Date));
  });
});
```

---

### Step 3: DailyLogModal — RED → GREEN → REFACTOR

สร้าง `src/components/dailyLog/__tests__/DailyLogModal.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { DailyLogModal } from '../DailyLogModal';
import { DailyTask } from '../../../types';

const selectedDate = new Date(2026, 4, 15); // May 15

const existingTasks: DailyTask[] = [
  { id: 't1', description: 'Morning workout', coins: 5, createdAt: new Date() },
];

describe('DailyLogModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    selectedDate,
    tasks: [],
    onSaveTasks: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
    defaultProps.onSaveTasks.mockClear();
  });

  // SR-41
  it('renders modal title with selected date', () => {
    render(<DailyLogModal {...defaultProps} />);
    expect(screen.getByText(/May 15, 2026/)).toBeInTheDocument();
  });

  it('renders existing tasks', () => {
    render(<DailyLogModal {...defaultProps} tasks={existingTasks} />);
    expect(screen.getByText('Morning workout')).toBeInTheDocument();
    expect(screen.getByText('🪙 5 coins')).toBeInTheDocument();
  });

  // SR-42
  it('renders task input field', () => {
    render(<DailyLogModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('What did you do?')).toBeInTheDocument();
  });

  it('adds task when "Add task" clicked', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('What did you do?'), 'Evening walk');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Evening walk')).toBeInTheDocument();
  });

  it('removes task when trash button clicked', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} tasks={existingTasks} />);
    await user.click(screen.getByRole('button', { name: /remove task/i }));
    expect(screen.queryByText('Morning workout')).not.toBeInTheDocument();
  });

  it('displays total coins correctly', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('What did you do?'), 'Run');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('🪙 5')).toBeInTheDocument(); // default 5 coins
  });

  // SR-43
  it('calls onSaveTasks with date and tasks when Save clicked', async () => {
    const user = userEvent.setup();
    render(<DailyLogModal {...defaultProps} tasks={existingTasks} />);
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(defaultProps.onSaveTasks).toHaveBeenCalledWith(selectedDate, existingTasks);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<DailyLogModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/May 15, 2026/)).not.toBeInTheDocument();
  });
});
```

---

### Step 4: Daily Log Business Logic — utils test

สร้าง `src/utils/__tests__/dailyLog.test.ts`

```typescript
import { calculateDayCoins, getDayStatus } from '../dailyLog';
import { DailyTask } from '../../types';

describe('calculateDayCoins', () => {
  // SR-44
  it('returns -10 when tasks array is empty (penalty)', () => {
    expect(calculateDayCoins([])).toBe(-10);
  });

  it('returns sum of task coins', () => {
    const tasks: DailyTask[] = [
      { id: '1', description: 'A', coins: 5, createdAt: new Date() },
      { id: '2', description: 'B', coins: 10, createdAt: new Date() },
    ];
    expect(calculateDayCoins(tasks)).toBe(15);
  });
});

describe('getDayStatus', () => {
  // SR-38, SR-39
  it('returns "penalty" when hasPenalty is true', () => {
    expect(getDayStatus({ hasPenalty: true, totalCoins: -10, tasks: [] } as any)).toBe('penalty');
  });

  it('returns "positive" when has tasks and coins > 0', () => {
    expect(getDayStatus({ hasPenalty: false, totalCoins: 15, tasks: [{}] } as any)).toBe('positive');
  });

  it('returns "default" when no entry', () => {
    expect(getDayStatus(null)).toBe('default');
  });
});
```

สร้าง `src/utils/dailyLog.ts` (ก่อน implement ใน component):

```typescript
import { DailyLogEntry, DailyTask } from '../types';

export const calculateDayCoins = (tasks: DailyTask[]): number => {
  if (tasks.length === 0) return -10; // penalty
  return tasks.reduce((sum, task) => sum + task.coins, 0);
};

export const getDayStatus = (entry: DailyLogEntry | null | undefined): 'positive' | 'penalty' | 'default' => {
  if (!entry) return 'default';
  if (entry.hasPenalty) return 'penalty';
  if (entry.totalCoins > 0) return 'positive';
  return 'default';
};
```

> **Senior insight:** แยก business logic ออกจาก component → test ง่ายกว่า, reuse ได้, และเป็นแนวทาง Go ที่ดีด้วย (pure functions)

---

## Output Artifacts (ISO 29110)

- [ ] `src/utils/dailyLog.ts` + test ผ่าน
- [ ] `src/components/dailyLog/MonthNavigator.tsx` + test ผ่าน
- [ ] `src/components/dailyLog/MonthCalendar.tsx` + test ผ่าน
- [ ] `src/components/dailyLog/DailyLogModal.tsx` + test ผ่าน
- [ ] `src/pages/DailyLog.tsx` (fully implemented)

---

## Definition of Done (DoD) — Sprint 05

- [ ] `npm test` — ทุก test GREEN (Sprint 01–05)
- [ ] Calendar แสดง May 2026 ถูกต้อง (เริ่มต้น วันจริง)
- [ ] Navigate prev/next เดือนได้
- [ ] Click วัน → modal เปิด
- [ ] เพิ่ม task → save → วันเปลี่ยนสีเหลือง
- [ ] วันว่าง → สีชมพู (mock data)
- [ ] PR merged → main ผ่าน CI

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-36 | MonthNavigator.test.tsx | renders month/year / prev / next |
| SR-37 | MonthCalendar.test.tsx | renders weekday headers / correct days |
| SR-38 | MonthCalendar.test.tsx | yellow for positive coins |
| SR-39 | MonthCalendar.test.tsx | pink for penalty |
| SR-40 | MonthCalendar.test.tsx | (visual verify — isToday) |
| SR-41 | MonthCalendar.test.tsx + DailyLogModal.test.tsx | onDayClick / modal title |
| SR-42 | DailyLogModal.test.tsx | add / remove tasks |
| SR-43 | DailyLogModal.test.tsx | calls onSaveTasks |
| SR-44 | dailyLog.test.ts | returns -10 when tasks empty |
| SR-45 | MonthCalendar.test.tsx | shows coin value |
