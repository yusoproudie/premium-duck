# Sprint 06 — Templates + Rewards Pages
> ISO 29110 Phase: **Software Implementation — Construction + Integration** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 3–4 วัน |
| Sprint Goal | Templates page (task patterns) + Rewards page (redeem coins) |
| Depends On | Sprint 05 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/06-templates-rewards` |

---

## ISO 29110 — Software Requirements (SI.1)

### Templates Requirements

| ID | Requirement | Priority |
|---|---|---|
| SR-46 | แสดง list ของ task templates ที่บันทึกไว้ | Must |
| SR-47 | สร้าง template ใหม่: name, type (fixed/time-based), coins, version | Must |
| SR-48 | ลบ template ได้ (พร้อม confirm) | Must |
| SR-49 | Template card แสดง name, coins, type, version | Must |

### Rewards Requirements

| ID | Requirement | Priority |
|---|---|---|
| SR-50 | แสดง list ของ rewards พร้อม emoji, name, cost | Must |
| SR-51 | สร้าง reward ใหม่: name, description, emoji, cost | Must |
| SR-52 | Redeem reward — หัก coins จาก total | Must |
| SR-53 | ไม่สามารถ redeem ถ้า coins ไม่พอ | Must |
| SR-54 | แสดง redemption history | Must |
| SR-55 | ลบ reward ได้ (พร้อม confirm) | Must |

---

## TDD Cycle — Sprint 06

### Templates

#### TemplateCard — RED → GREEN → REFACTOR

สร้าง `src/components/templates/__tests__/TemplateCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { TemplateCard } from '../TemplateCard';
import { TaskTemplate } from '../../../types';

const mockTemplate: TaskTemplate = {
  id: 'tmpl-1',
  name: 'Morning Workout',
  type: 'fixed',
  coins: 10,
  version: '1.0',
  createdAt: new Date(),
};

describe('TemplateCard', () => {
  const defaultProps = {
    template: mockTemplate,
    onDelete: jest.fn(),
  };

  // SR-49
  it('renders template name', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
  });

  it('renders coin value', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('renders type label', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText(/fixed/i)).toBeInTheDocument();
  });

  it('renders version', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText(/v1.0/i)).toBeInTheDocument();
  });

  // SR-48
  it('calls onDelete with confirm when delete button clicked', () => {
    window.confirm = jest.fn(() => true);
    render(<TemplateCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('tmpl-1');
  });

  it('does not call onDelete when confirm cancelled', () => {
    window.confirm = jest.fn(() => false);
    const handleDelete = jest.fn();
    render(<TemplateCard {...defaultProps} onDelete={handleDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).not.toHaveBeenCalled();
  });
});
```

#### TemplateModal — RED → GREEN → REFACTOR

สร้าง `src/components/templates/__tests__/TemplateModal.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { TemplateModal } from '../TemplateModal';

describe('TemplateModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  // SR-47
  it('renders name input', () => {
    render(<TemplateModal {...defaultProps} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders type select with fixed and time-based options', () => {
    render(<TemplateModal {...defaultProps} />);
    expect(screen.getByRole('option', { name: /fixed/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /time-based/i })).toBeInTheDocument();
  });

  it('renders coins input', () => {
    render(<TemplateModal {...defaultProps} />);
    expect(screen.getByLabelText(/coins/i)).toBeInTheDocument();
  });

  it('calls onSave with correct data when submitted', async () => {
    const user = userEvent.setup();
    render(<TemplateModal {...defaultProps} />);
    await user.type(screen.getByLabelText(/name/i), 'Daily Standup');
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Daily Standup' })
    );
  });

  it('does not call onSave when name is empty', async () => {
    const user = userEvent.setup();
    render(<TemplateModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(defaultProps.onSave).not.toHaveBeenCalled();
  });
});
```

---

### Rewards

#### RewardCard — RED → GREEN → REFACTOR

สร้าง `src/components/rewards/__tests__/RewardCard.test.tsx`

```typescript
import { render, screen, fireEvent } from '../../../test-utils/render';
import { RewardCard } from '../RewardCard';
import { Reward } from '../../../types';

const mockReward: Reward = {
  id: 'reward-1',
  name: 'Coffee Break',
  description: 'Treat yourself to a nice coffee',
  emoji: '☕',
  cost: 50,
  createdAt: new Date(),
};

describe('RewardCard', () => {
  const defaultProps = {
    reward: mockReward,
    currentCoins: 100,
    onRedeem: jest.fn(),
    onDelete: jest.fn(),
  };

  // SR-50
  it('renders reward name', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('Coffee Break')).toBeInTheDocument();
  });

  it('renders emoji', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('☕')).toBeInTheDocument();
  });

  it('renders cost', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('Treat yourself to a nice coffee')).toBeInTheDocument();
  });

  // SR-52
  it('calls onRedeem when Redeem button clicked and has enough coins', () => {
    render(<RewardCard {...defaultProps} currentCoins={100} />);
    fireEvent.click(screen.getByRole('button', { name: /redeem/i }));
    expect(defaultProps.onRedeem).toHaveBeenCalledWith('reward-1');
  });

  // SR-53
  it('disables Redeem button when coins insufficient', () => {
    render(<RewardCard {...defaultProps} currentCoins={20} />);
    expect(screen.getByRole('button', { name: /redeem/i })).toBeDisabled();
  });

  it('shows "Not enough coins" text when coins insufficient', () => {
    render(<RewardCard {...defaultProps} currentCoins={20} />);
    expect(screen.getByText(/not enough coins/i)).toBeInTheDocument();
  });

  // SR-55
  it('calls onDelete when delete button clicked with confirm', () => {
    window.confirm = jest.fn(() => true);
    render(<RewardCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(defaultProps.onDelete).toHaveBeenCalledWith('reward-1');
  });
});
```

#### Redemption History — RED → GREEN → REFACTOR

สร้าง `src/components/rewards/__tests__/RedemptionHistory.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { RedemptionHistoryList } from '../RedemptionHistoryList';
import { RedemptionHistory } from '../../../types';

const mockHistory: RedemptionHistory[] = [
  {
    id: 'rh-1',
    rewardId: 'r-1',
    rewardName: 'Coffee Break',
    rewardEmoji: '☕',
    coinsCost: 50,
    redeemedAt: new Date('2026-05-10'),
  },
];

describe('RedemptionHistoryList', () => {
  // SR-54
  it('renders history items', () => {
    render(<RedemptionHistoryList history={mockHistory} />);
    expect(screen.getByText('Coffee Break')).toBeInTheDocument();
    expect(screen.getByText('☕')).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('renders empty state when no history', () => {
    render(<RedemptionHistoryList history={[]} />);
    expect(screen.getByText(/no redemptions yet/i)).toBeInTheDocument();
  });

  it('renders date of redemption', () => {
    render(<RedemptionHistoryList history={mockHistory} />);
    expect(screen.getByText(/May 10, 2026/)).toBeInTheDocument();
  });
});
```

#### Coins calculation — utils test

สร้าง `src/utils/__tests__/coins.test.ts`

```typescript
import { canAfford, deductCoins } from '../coins';

describe('canAfford', () => {
  // SR-53
  it('returns true when current coins >= cost', () => {
    expect(canAfford(100, 50)).toBe(true);
    expect(canAfford(50, 50)).toBe(true);
  });

  it('returns false when current coins < cost', () => {
    expect(canAfford(30, 50)).toBe(false);
  });
});

describe('deductCoins', () => {
  // SR-52
  it('subtracts cost from total', () => {
    expect(deductCoins(100, 50)).toBe(50);
  });

  it('can result in negative (edge case)', () => {
    expect(deductCoins(10, 50)).toBe(-40);
  });
});
```

สร้าง `src/utils/coins.ts`:

```typescript
export const canAfford = (currentCoins: number, cost: number): boolean =>
  currentCoins >= cost;

export const deductCoins = (currentCoins: number, cost: number): number =>
  currentCoins - cost;
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/utils/coins.ts` + test ผ่าน
- [ ] `src/components/templates/TemplateCard.tsx` + test ผ่าน
- [ ] `src/components/templates/TemplateModal.tsx` + test ผ่าน
- [ ] `src/components/rewards/RewardCard.tsx` + test ผ่าน
- [ ] `src/components/rewards/RedemptionHistoryList.tsx` + test ผ่าน
- [ ] `src/pages/Templates.tsx` (fully implemented)
- [ ] `src/pages/Rewards.tsx` (fully implemented)

---

## Definition of Done (DoD) — Sprint 06

- [ ] `npm test` — ทุก test GREEN (Sprint 01–06)
- [ ] สร้าง/ลบ template ได้ใน browser
- [ ] สร้าง/ลบ reward ได้ใน browser
- [ ] Redeem reward → coins หัก, history เพิ่ม
- [ ] Redeem ไม่ได้เมื่อ coins ไม่พอ (button disabled)
- [ ] PR merged → main ผ่าน CI

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-46 | Templates.test.tsx | renders template list |
| SR-47 | TemplateModal.test.tsx | renders form / calls onSave |
| SR-48 | TemplateCard.test.tsx | calls onDelete with confirm |
| SR-49 | TemplateCard.test.tsx | renders name / coins / type / version |
| SR-50 | RewardCard.test.tsx | renders name / emoji / cost |
| SR-51 | RewardModal.test.tsx | renders form / calls onSave |
| SR-52 | RewardCard.test.tsx + coins.test.ts | calls onRedeem / deductCoins |
| SR-53 | RewardCard.test.tsx + coins.test.ts | disabled when insufficient / canAfford |
| SR-54 | RedemptionHistoryList.test.tsx | renders history items |
| SR-55 | RewardCard.test.tsx | calls onDelete with confirm |
