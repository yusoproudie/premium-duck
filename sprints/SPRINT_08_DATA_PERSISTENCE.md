# Sprint 08 — Data Persistence (localStorage + Context API)
> ISO 29110 Phase: **Software Implementation — Integration + Testing** | TDD Phase: **Integration Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 5–6 วัน |
| Sprint Goal | เชื่อม state ทั้ง app ผ่าน Context API + persist ลง localStorage — data ไม่หายเมื่อ refresh |
| Depends On | Sprint 07 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/08-data-persistence` |

---

## ISO 29110 — Software Requirements (SI.1)

| ID | Requirement | Priority |
|---|---|---|
| SR-65 | App State รวมศูนย์ผ่าน React Context — ทุก page ใช้ context เดียวกัน | Must |
| SR-66 | State persist ลง localStorage อัตโนมัติทุกครั้งที่เปลี่ยน | Must |
| SR-67 | Load state จาก localStorage เมื่อ app เปิด | Must |
| SR-68 | localStorage versioning — detect เมื่อ schema เปลี่ยน และ migrate หรือ reset | Must |
| SR-69 | Total coins ใน Sidebar อัปเดตแบบ real-time เมื่อ log task | Must |
| SR-70 | Radar chart ใน Dashboard อัปเดต score เมื่อ goals เปลี่ยน | Must |
| SR-71 | Reset data (Settings) ล้าง localStorage และ reset state กลับเป็น default | Must |

---

## Architecture — Context + useReducer Pattern

> **Senior insight:** ใช้ `useReducer` แทน `useState` หลายอัน เพราะ state มีความซับซ้อนและ actions ชัดเจน → ทดสอบง่ายกว่า, debug ง่ายกว่า

```
AppContext
  ├── state: AppState
  ├── dispatch: Dispatch<AppAction>
  └── Provider wraps ทั้ง App

AppAction (union type):
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'LOG_TASKS'; payload: { date: Date; tasks: DailyTask[] } }
  | { type: 'ADD_TEMPLATE'; payload: TaskTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'ADD_REWARD'; payload: Reward }
  | { type: 'REDEEM_REWARD'; payload: string }  // rewardId
  | { type: 'DELETE_REWARD'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'RESET_DATA' }
  | { type: 'LOAD_FROM_STORAGE'; payload: AppState }
```

---

## TDD Cycle — Sprint 08

### Step 1: AppReducer — RED → GREEN → REFACTOR

สร้าง `src/contexts/__tests__/appReducer.test.ts`

```typescript
import { appReducer, initialState } from '../appReducer';
import { AppState, Goal, DailyTask, Reward } from '../../types';

describe('appReducer', () => {
  // SR-65
  describe('ADD_GOAL', () => {
    it('adds goal to goals array', () => {
      const goal: Goal = {
        id: 'g1',
        name: 'Learn TDD',
        categoryId: 'skills',
        period: 'monthly',
        repeats: false,
        subGoals: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const nextState = appReducer(initialState, { type: 'ADD_GOAL', payload: goal });
      expect(nextState.goals).toHaveLength(1);
      expect(nextState.goals[0].name).toBe('Learn TDD');
    });
  });

  describe('DELETE_GOAL', () => {
    it('removes goal by id', () => {
      const stateWithGoal: AppState = {
        ...initialState,
        goals: [
          { id: 'g1', name: 'Test', categoryId: 'skills', period: 'monthly', repeats: false, subGoals: [], status: 'active', createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      const nextState = appReducer(stateWithGoal, { type: 'DELETE_GOAL', payload: 'g1' });
      expect(nextState.goals).toHaveLength(0);
    });
  });

  describe('LOG_TASKS', () => {
    const tasks: DailyTask[] = [
      { id: 't1', description: 'Morning run', coins: 10, createdAt: new Date() },
    ];

    // SR-69
    it('adds new log entry', () => {
      const date = new Date(2026, 4, 15);
      const nextState = appReducer(initialState, {
        type: 'LOG_TASKS',
        payload: { date, tasks },
      });
      expect(nextState.logEntries).toHaveLength(1);
      expect(nextState.logEntries[0].totalCoins).toBe(10);
    });

    it('updates existing log entry for same date', () => {
      const date = new Date(2026, 4, 15);
      const stateWithEntry: AppState = {
        ...initialState,
        logEntries: [{
          id: 'e1',
          date,
          tasks: [{ id: 't0', description: 'Old', coins: 5, createdAt: new Date() }],
          totalCoins: 5,
          hasPenalty: false,
        }],
      };

      const nextState = appReducer(stateWithEntry, {
        type: 'LOG_TASKS',
        payload: { date, tasks },
      });
      expect(nextState.logEntries).toHaveLength(1);
      expect(nextState.logEntries[0].totalCoins).toBe(10); // updated
    });

    it('applies penalty when tasks array is empty', () => {
      const date = new Date(2026, 4, 15);
      const nextState = appReducer(initialState, {
        type: 'LOG_TASKS',
        payload: { date, tasks: [] },
      });
      expect(nextState.logEntries[0].totalCoins).toBe(-10);
      expect(nextState.logEntries[0].hasPenalty).toBe(true);
    });

    it('updates userProfile totalCoins', () => {
      const date = new Date(2026, 4, 15);
      const nextState = appReducer(initialState, {
        type: 'LOG_TASKS',
        payload: { date, tasks },
      });
      expect(nextState.userProfile.totalCoins).toBe(10);
    });
  });

  describe('REDEEM_REWARD', () => {
    // SR-52, SR-53
    const stateWithReward: AppState = {
      ...initialState,
      userProfile: { ...initialState.userProfile, totalCoins: 100 },
      rewards: [{
        id: 'r1',
        name: 'Coffee',
        description: '',
        emoji: '☕',
        cost: 50,
        createdAt: new Date(),
      }],
    };

    it('deducts coins from userProfile', () => {
      const nextState = appReducer(stateWithReward, {
        type: 'REDEEM_REWARD',
        payload: 'r1',
      });
      expect(nextState.userProfile.totalCoins).toBe(50);
    });

    it('adds to redemption history', () => {
      const nextState = appReducer(stateWithReward, {
        type: 'REDEEM_REWARD',
        payload: 'r1',
      });
      expect(nextState.redemptionHistory).toHaveLength(1);
      expect(nextState.redemptionHistory[0].rewardName).toBe('Coffee');
    });
  });

  describe('RESET_DATA', () => {
    // SR-71
    it('returns initialState', () => {
      const dirtyState: AppState = {
        ...initialState,
        goals: [{ id: 'g1', name: 'Test', categoryId: 'skills', period: 'monthly', repeats: false, subGoals: [], status: 'active', createdAt: new Date(), updatedAt: new Date() }],
      };

      const nextState = appReducer(dirtyState, { type: 'RESET_DATA' });
      expect(nextState.goals).toHaveLength(0);
      expect(nextState.userProfile.totalCoins).toBe(0);
    });
  });
});
```

---

### Step 2: localStorage Service — RED → GREEN → REFACTOR

สร้าง `src/services/__tests__/storage.test.ts`

```typescript
import { saveState, loadState, clearState, STORAGE_VERSION } from '../storage';
import { initialState } from '../../contexts/appReducer';

// localStorage mock มาจาก jest (jsdom มีให้แล้ว)
beforeEach(() => {
  localStorage.clear();
});

describe('saveState', () => {
  // SR-66
  it('saves state to localStorage', () => {
    saveState(initialState);
    const stored = localStorage.getItem('premium-duck-data');
    expect(stored).not.toBeNull();
  });

  it('includes version in stored data', () => {
    saveState(initialState);
    const stored = JSON.parse(localStorage.getItem('premium-duck-data')!);
    expect(stored.version).toBe(STORAGE_VERSION);
  });
});

describe('loadState', () => {
  // SR-67
  it('returns null when no data in localStorage', () => {
    expect(loadState()).toBeNull();
  });

  it('returns saved state when data exists', () => {
    saveState({ ...initialState, userProfile: { ...initialState.userProfile, name: 'Proudie' } });
    const loaded = loadState();
    expect(loaded?.userProfile.name).toBe('Proudie');
  });

  // SR-68
  it('returns null when version mismatch', () => {
    localStorage.setItem('premium-duck-data', JSON.stringify({
      version: '0.0.1', // old version
      ...initialState,
    }));
    expect(loadState()).toBeNull(); // migration/reset
  });
});

describe('clearState', () => {
  // SR-71
  it('removes data from localStorage', () => {
    saveState(initialState);
    clearState();
    expect(localStorage.getItem('premium-duck-data')).toBeNull();
  });
});
```

สร้าง `src/services/storage.ts`:

```typescript
import { AppState } from '../types';

export const STORAGE_VERSION = '1.0.0';
const STORAGE_KEY = 'premium-duck-data';

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      ...state,
    }));
  } catch {
    // localStorage เต็มหรือ private mode — silently fail
  }
};

export const loadState = (): AppState | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const parsed = JSON.parse(serialized);
    if (parsed.version !== STORAGE_VERSION) return null; // SR-68: version mismatch
    const { version, ...state } = parsed;
    return state as AppState;
  } catch {
    return null;
  }
};

export const clearState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
```

---

### Step 3: AppContext — Integration Test

สร้าง `src/contexts/__tests__/AppContext.test.tsx`

```typescript
import { render, screen } from '../../test-utils/render';
import userEvent from '@testing-library/user-event';
import { AppProvider, useApp } from '../AppContext';

// Test component ที่ใช้ context
const TestConsumer: React.FC = () => {
  const { state, dispatch } = useApp();
  return (
    <div>
      <span data-testid="coins">{state.userProfile.totalCoins}</span>
      <button
        onClick={() => dispatch({
          type: 'LOG_TASKS',
          payload: {
            date: new Date(),
            tasks: [{ id: 't1', description: 'Run', coins: 5, createdAt: new Date() }],
          },
        })}
      >
        Log Task
      </button>
    </div>
  );
};

describe('AppContext', () => {
  it('provides initial state', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('coins')).toHaveTextContent('0');
  });

  // SR-69
  it('updates coins when task logged', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Log Task' }));
    expect(screen.getByTestId('coins')).toHaveTextContent('5');
  });

  // SR-67: load from localStorage
  it('loads state from localStorage on mount', () => {
    localStorage.setItem('premium-duck-data', JSON.stringify({
      version: '1.0.0',
      userProfile: { id: '1', name: 'Proudie', totalCoins: 999, createdAt: new Date() },
      categories: [],
      goals: [],
      logEntries: [],
      templates: [],
      rewards: [],
      redemptionHistory: [],
    }));

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    expect(screen.getByTestId('coins')).toHaveTextContent('999');
    localStorage.clear();
  });
});
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/contexts/appReducer.ts` + test ผ่าน
- [ ] `src/contexts/AppContext.tsx` + test ผ่าน
- [ ] `src/services/storage.ts` + test ผ่าน
- [ ] App.tsx ใช้ `AppProvider` wrap ทุก page
- [ ] ทุก page ใช้ `useApp()` hook แทน local state
- [ ] Sidebar รับ `totalCoins` จาก context

---

## Definition of Done (DoD) — Sprint 08

- [ ] `npm test` — ทุก test GREEN (Sprint 01–08)
- [ ] เพิ่ม goal → reload browser → goal ยังอยู่
- [ ] Log task → coins ใน Sidebar อัปเดต real-time
- [ ] Reset data → ทุก page กลับ empty state
- [ ] localStorage มี version field
- [ ] PR merged → main ผ่าน CI

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-65 | AppContext.test.tsx | provides initial state |
| SR-66 | storage.test.ts | saves state to localStorage |
| SR-67 | storage.test.ts + AppContext.test.tsx | returns saved state / loads from storage |
| SR-68 | storage.test.ts | returns null on version mismatch |
| SR-69 | AppContext.test.tsx | updates coins when task logged |
| SR-70 | Dashboard.test.tsx (update) | radar chart updates with goals |
| SR-71 | appReducer.test.ts | RESET_DATA returns initialState |
