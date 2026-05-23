# Sprint 04 — Goals Page
> ISO 29110 Phase: **Software Implementation — Construction + Integration** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 4–5 วัน |
| Sprint Goal | Goals page ที่ fully functional: CRUD goals, CategoryTabs, GoalModal, GoalCard |
| Depends On | Sprint 03 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/04-goals` |

---

## ISO 29110 — Software Requirements (SI.1)

| ID | Requirement | Priority |
|---|---|---|
| SR-26 | CategoryTabs แสดง 6 default categories พร้อม emoji | Must |
| SR-27 | Click tab เปลี่ยน active category — highlight ที่ active tab | Must |
| SR-28 | Goal form รับ: name, description, category, period, deadline, repeats, sub-goals | Must |
| SR-29 | Goal form validate — name ต้องไม่ว่าง | Must |
| SR-30 | เพิ่ม sub-goal ได้หลาย items, ลบ sub-goal แต่ละอันได้ | Must |
| SR-31 | GoalCard แสดง goal name, category emoji, period, deadline (ถ้ามี) | Must |
| SR-32 | GoalCard แสดง sub-goal progress bar (completed/total) | Must |
| SR-33 | ลบ Goal ได้ด้วยปุ่ม trash — ต้องมี confirmation | Must |
| SR-34 | Goals filter ตาม active category tab | Must |
| SR-35 | Empty state แสดงเมื่อไม่มี goals ใน category นั้น | Must |

---

## TDD Cycle — Sprint 04

### Step 1: CategoryTabs — RED → GREEN → REFACTOR

สร้าง `src/components/goals/__tests__/CategoryTabs.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { CategoryTabs } from '../CategoryTabs';
import { Category } from '../../../types';

const mockCategories: Category[] = [
  { id: 'work', name: 'Work & Career', emoji: '💼', section: 'head', isDefault: true },
  { id: 'skills', name: 'Skills & Learning', emoji: '📚', section: 'head', isDefault: true },
  { id: 'health', name: 'Health & Wellness', emoji: '🌱', section: 'body', isDefault: true },
];

describe('CategoryTabs', () => {
  // SR-26
  it('renders all category tabs with emoji', () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={jest.fn()}
      />
    );
    expect(screen.getByText('Work & Career')).toBeInTheDocument();
    expect(screen.getByText('Skills & Learning')).toBeInTheDocument();
    expect(screen.getByText('Health & Wellness')).toBeInTheDocument();
    expect(screen.getByText('💼')).toBeInTheDocument();
  });

  // SR-27
  it('applies active styling to active category', () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={jest.fn()}
      />
    );
    const activeTab = screen.getByText('Work & Career').closest('button');
    expect(activeTab).toHaveClass('bg-cozy-yellow');
  });

  it('does not apply active styling to inactive categories', () => {
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={jest.fn()}
      />
    );
    const inactiveTab = screen.getByText('Skills & Learning').closest('button');
    expect(inactiveTab).not.toHaveClass('bg-cozy-yellow');
  });

  it('calls onCategoryChange with category id when tab clicked', () => {
    const handleChange = jest.fn();
    render(
      <CategoryTabs
        categories={mockCategories}
        activeCategory="work"
        onCategoryChange={handleChange}
      />
    );
    fireEvent.click(screen.getByText('Skills & Learning'));
    expect(handleChange).toHaveBeenCalledWith('skills');
  });
});
```

---

### Step 2: GoalCard — RED → GREEN → REFACTOR

สร้าง `src/components/goals/__tests__/GoalCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { GoalCard } from '../GoalCard';
import { Goal, Category } from '../../../types';

const mockCategory: Category = {
  id: 'skills',
  name: 'Skills & Learning',
  emoji: '📚',
  section: 'head',
  isDefault: true,
};

const mockGoal: Goal = {
  id: 'goal-1',
  name: 'Learn React Testing',
  description: 'Master RTL and Jest',
  categoryId: 'skills',
  period: 'monthly',
  deadline: new Date('2026-06-30'),
  repeats: false,
  subGoals: [
    { id: 'sg-1', text: 'Read docs', completed: true },
    { id: 'sg-2', text: 'Build project', completed: false },
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GoalCard', () => {
  const defaultProps = {
    goal: mockGoal,
    category: mockCategory,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  // SR-31
  it('renders goal name', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('Learn React Testing')).toBeInTheDocument();
  });

  it('renders category emoji', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('renders period', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
  });

  it('renders deadline when provided', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText(/Jun 30, 2026/)).toBeInTheDocument();
  });

  it('does not render deadline when not provided', () => {
    const goalWithoutDeadline = { ...mockGoal, deadline: undefined };
    render(<GoalCard {...defaultProps} goal={goalWithoutDeadline} />);
    expect(screen.queryByText(/Due/)).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('Master RTL and Jest')).toBeInTheDocument();
  });

  // SR-32
  it('renders progress bar when sub-goals exist', () => {
    render(<GoalCard {...defaultProps} />);
    expect(screen.getByText('1/2')).toBeInTheDocument(); // 1 completed, 2 total
  });

  it('does not render progress section when no sub-goals', () => {
    const goalNoSubGoals = { ...mockGoal, subGoals: [] };
    render(<GoalCard {...defaultProps} goal={goalNoSubGoals} />);
    expect(screen.queryByText(/Progress/)).not.toBeInTheDocument();
  });

  // SR-33
  it('calls onDelete when delete button clicked', () => {
    const handleDelete = jest.fn();
    // mock window.confirm
    window.confirm = jest.fn(() => true);
    render(<GoalCard {...defaultProps} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith('goal-1');
  });

  it('does not call onDelete when confirm is cancelled', () => {
    const handleDelete = jest.fn();
    window.confirm = jest.fn(() => false);
    render(<GoalCard {...defaultProps} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).not.toHaveBeenCalled();
  });

  it('calls onEdit when edit button clicked', () => {
    const handleEdit = jest.fn();
    render(<GoalCard {...defaultProps} onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(mockGoal);
  });
});
```

---

### Step 3: GoalModal — RED → GREEN → REFACTOR

สร้าง `src/components/goals/__tests__/GoalModal.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { GoalModal } from '../GoalModal';
import { Category } from '../../../types';

const mockCategories: Category[] = [
  { id: 'skills', name: 'Skills & Learning', emoji: '📚', section: 'head', isDefault: true },
  { id: 'health', name: 'Health & Wellness', emoji: '🌱', section: 'body', isDefault: true },
];

describe('GoalModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    categories: mockCategories,
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
    defaultProps.onSave.mockClear();
  });

  // SR-28
  it('renders name input', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders description textarea', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders category select with all options', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: /Skills & Learning/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Health & Wellness/i })).toBeInTheDocument();
  });

  it('renders period select', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: 'Monthly' })).toBeInTheDocument();
  });

  it('renders deadline input', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
  });

  it('renders repeats checkbox', () => {
    render(<GoalModal {...defaultProps} />);
    expect(screen.getByRole('checkbox', { name: /repeats/i })).toBeInTheDocument();
  });

  // SR-29
  it('does not call onSave when name is empty', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /save goal/i }));
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });

  // SR-30
  it('adds sub-goal when input filled and Add button clicked', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Step...'), 'First step');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    expect(screen.getByText('First step')).toBeInTheDocument();
  });

  it('removes sub-goal when X button clicked', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Step...'), 'First step');
    await user.click(screen.getByRole('button', { name: /^Add$/i }));
    fireEvent.click(screen.getByRole('button', { name: /remove sub-goal/i }));
    expect(screen.queryByText('First step')).not.toBeInTheDocument();
  });

  it('calls onSave with goal data when form submitted with valid name', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Learn TDD');
    await user.click(screen.getByRole('button', { name: /save goal/i }));

    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Learn TDD',
        categoryId: 'skills', // default first category
      })
    );
  });

  it('resets form after successful save', async () => {
    const user = userEvent.setup();
    render(<GoalModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Learn TDD');
    await user.click(screen.getByRole('button', { name: /save goal/i }));
    // modal closes, form resets — verify onClose called
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
```

---

### Step 4: Goals Page Integration

สร้าง `src/pages/__tests__/Goals.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../test-utils/render';
import userEvent from '@testing-library/user-event';
import Goals from '../Goals';

describe('Goals Page', () => {
  // SR-26
  it('renders category tabs', () => {
    render(<Goals />);
    expect(screen.getByText('Work & Career')).toBeInTheDocument();
    expect(screen.getByText('Skills & Learning')).toBeInTheDocument();
  });

  it('renders "New goal" button', () => {
    render(<Goals />);
    expect(screen.getByRole('button', { name: /new goal/i })).toBeInTheDocument();
  });

  // SR-35
  it('shows empty state initially', () => {
    render(<Goals />);
    expect(screen.getByText(/no.*goals yet/i)).toBeInTheDocument();
  });

  it('opens modal when "New goal" clicked', async () => {
    const user = userEvent.setup();
    render(<Goals />);
    await user.click(screen.getByRole('button', { name: /new goal/i }));
    expect(screen.getByText('New goal')).toBeInTheDocument(); // modal title
  });

  // SR-34
  it('filters goals by active category tab', async () => {
    const user = userEvent.setup();
    render(<Goals />);

    // สร้าง goal ใน Skills category
    await user.click(screen.getByRole('button', { name: /new goal/i }));
    await user.type(screen.getByLabelText(/name/i), 'Learn TypeScript');
    await user.click(screen.getByRole('button', { name: /save goal/i }));

    // switch tab ไป Health — goal ไม่ควรเห็น
    await user.click(screen.getByText('Health & Wellness'));
    expect(screen.queryByText('Learn TypeScript')).not.toBeInTheDocument();

    // switch กลับ Skills — ควรเห็น
    await user.click(screen.getByText('Skills & Learning'));
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
  });
});
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/components/goals/CategoryTabs.tsx` + test ผ่าน
- [ ] `src/components/goals/GoalCard.tsx` + test ผ่าน
- [ ] `src/components/goals/GoalModal.tsx` + test ผ่าน
- [ ] `src/pages/Goals.tsx` (fully implemented) + test ผ่าน

---

## Definition of Done (DoD) — Sprint 04

- [ ] `npm test` — ทุก test GREEN (Sprint 01–04)
- [ ] สร้าง goal ได้จริงใน browser — card แสดงผล
- [ ] ลบ goal ได้ — window.confirm ทำงาน
- [ ] Filter tabs เปลี่ยน goals ที่แสดง
- [ ] Sub-goals progress bar แสดงผลถูกต้อง
- [ ] PR merged → main ผ่าน CI

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-26 | CategoryTabs.test.tsx | renders all category tabs |
| SR-27 | CategoryTabs.test.tsx | active styling / onCategoryChange |
| SR-28 | GoalModal.test.tsx | renders all form fields |
| SR-29 | GoalModal.test.tsx | does not call onSave when name empty |
| SR-30 | GoalModal.test.tsx | adds / removes sub-goal |
| SR-31 | GoalCard.test.tsx | renders name / emoji / period / deadline |
| SR-32 | GoalCard.test.tsx | renders progress bar |
| SR-33 | GoalCard.test.tsx | calls onDelete with confirm |
| SR-34 | Goals.test.tsx | filters goals by category tab |
| SR-35 | Goals.test.tsx | shows empty state initially |
