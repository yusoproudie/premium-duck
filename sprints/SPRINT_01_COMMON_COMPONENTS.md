# Sprint 01 — TypeScript Types + Common Components
> ISO 29110 Phase: **Software Implementation — Software Design + Construction** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 3–4 วัน |
| Sprint Goal | สร้าง TypeScript types ที่สมบูรณ์ และ Common UI components ทั้งหมดโดยใช้ TDD |
| Depends On | Sprint 00 ผ่าน DoD แล้ว |
| Status | Not Started |
| Branch | `sprint/01-common-components` |

---

## ISO 29110 — Software Requirements (SI.1)

### Functional Requirements — Sprint 01

| ID | Requirement | Priority |
|---|---|---|
| SR-01 | Button รองรับ variant: primary, secondary, danger, ghost | Must |
| SR-02 | Button รองรับ size: sm, md, lg และ fullWidth | Must |
| SR-03 | Button disabled state ต้องแสดง visual feedback และ block click | Must |
| SR-04 | Input รองรับ label, error message, และ standard HTML attributes | Must |
| SR-05 | Textarea รองรับ label, error message | Must |
| SR-06 | Select รองรับ options array, label, error | Must |
| SR-07 | Modal แสดง/ซ่อนได้ด้วย isOpen prop, ปิดได้ด้วย X button | Must |
| SR-08 | Badge รองรับ variant: head, body, feet, default | Must |
| SR-09 | EmptyState แสดง message และ optional action button | Must |
| SR-10 | TypeScript types ครอบคลุมทุก domain entity | Must |

---

## TDD Cycle — Sprint 01

> **กฎ:** เขียนทุก test ก่อน → รัน → เห็น RED → implement → รัน → เห็น GREEN → refactor

### Step 1: สร้าง Types ก่อน (ไม่มี test แต่เป็น foundation)

สร้าง `src/types/index.ts` ก่อน — types ไม่ต้องทำ TDD แต่ต้องครบ:

```typescript
// User Profile
export interface UserProfile {
  id: string;
  name: string;
  totalCoins: number;
  createdAt: Date;
}

// Category
export interface Category {
  id: string;
  name: string;
  emoji: string;
  section: 'head' | 'body' | 'feet';
  isDefault: boolean;
}

// Goal
export interface Goal {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  deadline?: Date;
  repeats: boolean;
  subGoals: SubGoal[];
  status: 'active' | 'backlog' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface SubGoal {
  id: string;
  text: string;
  completed: boolean;
}

// Task Template
export interface TaskTemplate {
  id: string;
  name: string;
  type: 'fixed' | 'time-based';
  coins: number;
  version: string;
  createdAt: Date;
}

// Daily Log
export interface DailyTask {
  id: string;
  description: string;
  coins: number;
  categoryId?: string;
  createdAt: Date;
}

export interface DailyLogEntry {
  id: string;
  date: Date;
  tasks: DailyTask[];
  totalCoins: number;
  hasPenalty: boolean;
}

// Reward
export interface Reward {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  createdAt: Date;
}

export interface RedemptionHistory {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardEmoji: string;
  coinsCost: number;
  redeemedAt: Date;
}

// Analytics
export interface RadarDataPoint {
  category: string;
  score: number;
  fullMark: number;
}

// App State (สำหรับ Context)
export interface AppState {
  userProfile: UserProfile;
  categories: Category[];
  goals: Goal[];
  logEntries: DailyLogEntry[];
  templates: TaskTemplate[];
  rewards: Reward[];
  redemptionHistory: RedemptionHistory[];
}
```

---

### Step 2: Button Component — RED → GREEN → REFACTOR

#### 🔴 RED — เขียน test ก่อน

สร้าง `src/components/common/__tests__/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { Button } from '../Button';

describe('Button', () => {
  // SR-01: variants
  describe('variants', () => {
    it('renders primary variant with yellow background class', () => {
      render(<Button variant="primary">Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn).toHaveClass('bg-cozy-yellow');
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

  // SR-02: sizes
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

  // SR-03: disabled state
  describe('disabled state', () => {
    it('is disabled when disabled prop is passed', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // onClick
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders children correctly', () => {
    render(<Button>Hello World</Button>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

#### 🟢 GREEN — สร้าง Button.tsx ให้ test ผ่าน

สร้าง `src/components/common/Button.tsx` (ดู implementation ใน PREMIUM_DUCK_DEVELOPMENT_PLAN.md Phase 2, Step 2.2)

#### 🔵 REFACTOR — หลัง test ผ่านแล้ว
- ตรวจ class names ซ้ำซ้อนไหม
- ตรวจ props type completeness

---

### Step 3: Input Component — RED → GREEN → REFACTOR

#### 🔴 RED — เขียน test ก่อน

สร้าง `src/components/common/__tests__/Input.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { Input } from '../Input';

describe('Input', () => {
  // SR-04
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
    const handleChange = jest.fn();
    render(<Input value="test" onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });

  it('calls onChange when user types', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('passes placeholder to input', () => {
    render(<Input placeholder="Type here..." />);
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
  });
});
```

#### 🟢 GREEN — สร้าง Input.tsx

---

### Step 4: Modal Component — RED → GREEN → REFACTOR

#### 🔴 RED — เขียน test ก่อน

สร้าง `src/components/common/__tests__/Modal.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { Modal } from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  // SR-07
  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders title correctly', () => {
    render(<Modal {...defaultProps} title="My Modal" />);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders children content', () => {
    render(
      <Modal {...defaultProps}>
        <p>Custom content</p>
      </Modal>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
```

> **หมายเหตุ:** ถ้า @headlessui/react ใช้ Portal จะต้องเพิ่ม `document.body` ใน query บางอัน — ทดสอบแล้วค่อย adjust

---

### Step 5: Badge Component — RED → GREEN → REFACTOR

สร้าง `src/components/common/__tests__/Badge.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { Badge } from '../Badge';

describe('Badge', () => {
  // SR-08
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
```

---

### Step 6: EmptyState Component — RED → GREEN → REFACTOR

สร้าง `src/components/common/__tests__/EmptyState.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  // SR-09
  it('renders message', () => {
    render(<EmptyState message="No goals yet" />);
    expect(screen.getByText('No goals yet')).toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const handleAction = jest.fn();
    render(
      <EmptyState
        message="Empty"
        actionLabel="Create one"
        onAction={handleAction}
      />
    );
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });

  it('does not render action button when no actionLabel', () => {
    render(<EmptyState message="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onAction when action button clicked', () => {
    const handleAction = jest.fn();
    render(
      <EmptyState message="Empty" actionLabel="Add" onAction={handleAction} />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
```

---

### Step 7: Select + Textarea — เขียน test แบบเดียวกัน

สร้าง `src/components/common/__tests__/Select.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Select options={options} label="Category" />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Select options={options} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
```

สร้าง `src/components/common/__tests__/Textarea.test.tsx` — ใช้ pattern เดียวกับ Input

---

### Step 8: Export barrel + Smoke test

สร้าง `src/components/common/index.ts`

```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Textarea } from './Textarea';
export { Select } from './Select';
export { Modal } from './Modal';
export { Badge } from './Badge';
export { EmptyState } from './EmptyState';
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/types/index.ts` — TypeScript types ครบทุก domain
- [ ] `src/components/common/Button.tsx` + test ผ่าน
- [ ] `src/components/common/Input.tsx` + test ผ่าน
- [ ] `src/components/common/Textarea.tsx` + test ผ่าน
- [ ] `src/components/common/Select.tsx` + test ผ่าน
- [ ] `src/components/common/Modal.tsx` + test ผ่าน
- [ ] `src/components/common/Badge.tsx` + test ผ่าน
- [ ] `src/components/common/EmptyState.tsx` + test ผ่าน
- [ ] `src/components/common/index.ts`

---

## Definition of Done (DoD) — Sprint 01

- [ ] `npm test` — ทุก test GREEN (ไม่มี SKIP)
- [ ] Test coverage common components ≥ 80%
- [ ] TypeScript compiler — `npx tsc --noEmit` ไม่มี error
- [ ] `npm run build` ผ่าน
- [ ] PR merged → main ผ่าน CI
- [ ] Storybook หรือ manual verify ว่า component render ถูกต้องใน browser

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-01 | Button.test.tsx | variants > renders primary/secondary/danger/ghost |
| SR-02 | Button.test.tsx | sizes > renders sm/md/lg/fullWidth |
| SR-03 | Button.test.tsx | disabled state > is disabled / does not call onClick |
| SR-04 | Input.test.tsx | renders label / error / onChange |
| SR-05 | Textarea.test.tsx | renders label / error |
| SR-06 | Select.test.tsx | renders options / label / error |
| SR-07 | Modal.test.tsx | renders when open / hides when closed / onClose |
| SR-08 | Badge.test.tsx | applies head/body/feet/default variant |
| SR-09 | EmptyState.test.tsx | renders message / action button |
