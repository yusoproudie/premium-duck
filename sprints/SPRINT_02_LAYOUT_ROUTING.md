# Sprint 02 — Layout + Routing
> ISO 29110 Phase: **Software Implementation — Software Design + Construction** | TDD Phase: **Unit Tests**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 2–3 วัน |
| Sprint Goal | สร้าง Sidebar, Layout, Routing และ Page shells ทั้งหมด พร้อม test |
| Depends On | Sprint 01 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/02-layout-routing` |

---

## ISO 29110 — Software Requirements (SI.1)

| ID | Requirement | Priority |
|---|---|---|
| SR-11 | Sidebar แสดง navigation 7 items (Dashboard, Goals, Daily Log, Templates, Rewards, Analytics, Settings) | Must |
| SR-12 | Active nav item ต้องมี visual highlight (yellow background) | Must |
| SR-13 | CoinCounter แสดงค่า coins — สีแดงถ้า negative | Must |
| SR-14 | MainLayout วาง Sidebar ซ้าย + content area ขวา | Must |
| SR-15 | PageHeader แสดง greeting "Hello, Friend 👋", title, subtitle, และ optional action | Must |
| SR-16 | Routing ทำงานถูกต้อง — navigate ระหว่าง 7 pages ได้ | Must |
| SR-17 | URL ตรงกับ page (/ = Dashboard, /goals = Goals, etc.) | Must |

---

## TDD Cycle — Sprint 02

### Step 1: CoinCounter — RED → GREEN → REFACTOR

สร้าง `src/components/layout/__tests__/CoinCounter.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { CoinCounter } from '../CoinCounter';

describe('CoinCounter', () => {
  // SR-13
  it('displays coin value', () => {
    render(<CoinCounter coins={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays "coins" label', () => {
    render(<CoinCounter coins={100} />);
    expect(screen.getByText('coins')).toBeInTheDocument();
  });

  it('applies red text when coins are negative', () => {
    render(<CoinCounter coins={-50} />);
    const coinValue = screen.getByText('-50');
    expect(coinValue).toHaveClass('text-red-500');
  });

  it('does not apply red text when coins are positive', () => {
    render(<CoinCounter coins={100} />);
    const coinValue = screen.getByText('100');
    expect(coinValue).not.toHaveClass('text-red-500');
  });

  it('does not apply red text when coins are zero', () => {
    render(<CoinCounter coins={0} />);
    const coinValue = screen.getByText('0');
    expect(coinValue).not.toHaveClass('text-red-500');
  });
});
```

---

### Step 2: PageHeader — RED → GREEN → REFACTOR

สร้าง `src/components/layout/__tests__/PageHeader.test.tsx`

```typescript
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
    // ไม่มี subtitle element
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
```

---

### Step 3: Sidebar Navigation — RED → GREEN → REFACTOR

สร้าง `src/components/layout/__tests__/Sidebar.test.tsx`

```typescript
import { render, screen } from '../../../test-utils/render';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  // SR-11
  it('renders all 7 navigation items', () => {
    render(<Sidebar totalCoins={0} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Daily Log')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Rewards')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders app brand name "Premium Duck"', () => {
    render(<Sidebar totalCoins={0} />);
    expect(screen.getByText('Premium Duck')).toBeInTheDocument();
  });

  it('renders CoinCounter with correct coins value', () => {
    render(<Sidebar totalCoins={250} />);
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Sidebar totalCoins={0} />);
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Goals/i })).toHaveAttribute('href', '/goals');
    expect(screen.getByRole('link', { name: /Daily Log/i })).toHaveAttribute('href', '/daily-log');
  });
});
```

> **หมายเหตุ TDD:** NavLink ของ react-router ต้องการ BrowserRouter ซึ่ง custom render ใน Sprint 00 wrap ไว้แล้ว
> Active state test ทำได้ยากใน unit test — จะทดสอบใน Sprint 09 (Integration/E2E)

---

### Step 4: Routing — ทดสอบ page navigation

สร้าง `src/__tests__/routing.test.tsx`

```typescript
import { render, screen } from '../test-utils/render';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// helper render ที่รับ initialRoute
const renderWithRoute = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
};

describe('Routing', () => {
  // SR-16, SR-17
  it('renders Dashboard on "/"', () => {
    renderWithRoute('/');
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders Goals on "/goals"', () => {
    renderWithRoute('/goals');
    expect(screen.getByRole('heading', { name: 'Goals' })).toBeInTheDocument();
  });

  it('renders Daily Log on "/daily-log"', () => {
    renderWithRoute('/daily-log');
    expect(screen.getByRole('heading', { name: /daily log/i })).toBeInTheDocument();
  });

  it('renders Templates on "/templates"', () => {
    renderWithRoute('/templates');
    expect(screen.getByRole('heading', { name: /templates/i })).toBeInTheDocument();
  });

  it('renders Rewards on "/rewards"', () => {
    renderWithRoute('/rewards');
    expect(screen.getByRole('heading', { name: /rewards/i })).toBeInTheDocument();
  });

  it('renders Analytics on "/analytics"', () => {
    renderWithRoute('/analytics');
    expect(screen.getByRole('heading', { name: /analytics/i })).toBeInTheDocument();
  });

  it('renders Settings on "/settings"', () => {
    renderWithRoute('/settings');
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  });
});
```

> **หมายเหตุ:** ถ้า App ใช้ BrowserRouter ต้องปรับ App.tsx ให้ accept router จากข้างนอกได้ (ดู pattern ด้านล่าง)

#### App.tsx Pattern ที่ testable ได้:

```typescript
// แยก Routes ออกมาเป็น AppRoutes component
export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/goals" element={<Goals />} />
    <Route path="/daily-log" element={<DailyLog />} />
    <Route path="/templates" element={<Templates />} />
    <Route path="/rewards" element={<Rewards />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
);

// App wrap ด้วย BrowserRouter สำหรับ production
function App() {
  return (
    <BrowserRouter>
      <MainLayout totalCoins={0}>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}
```

---

## Output Artifacts (ISO 29110)

- [ ] `src/components/layout/CoinCounter.tsx` + test ผ่าน
- [ ] `src/components/layout/Sidebar.tsx` + test ผ่าน
- [ ] `src/components/layout/PageHeader.tsx` + test ผ่าน
- [ ] `src/components/layout/MainLayout.tsx`
- [ ] `src/pages/Dashboard.tsx` (shell)
- [ ] `src/pages/Goals.tsx` (shell)
- [ ] `src/pages/DailyLog.tsx` (shell)
- [ ] `src/pages/Templates.tsx` (shell)
- [ ] `src/pages/Rewards.tsx` (shell)
- [ ] `src/pages/Analytics.tsx` (shell)
- [ ] `src/pages/Settings.tsx` (shell)
- [ ] `src/App.tsx` ที่มี `AppRoutes` แยกออกมา (testable)
- [ ] `src/__tests__/routing.test.tsx` ผ่าน

---

## Definition of Done (DoD) — Sprint 02

- [ ] `npm test` — ทุก test GREEN รวมถึง Sprint 01
- [ ] Navigate ระหว่าง pages ได้ใน browser — ไม่มี 404
- [ ] Active link มี yellow highlight เมื่อ navigate
- [ ] CoinCounter แสดงค่าถูกต้อง (ใส่ mock value -295 ดูได้)
- [ ] TypeScript ไม่มี error
- [ ] PR merged → main ผ่าน CI

---

## Traceability Matrix (ISO 29110)

| Requirement | Test File | Test Name |
|---|---|---|
| SR-11 | Sidebar.test.tsx | renders all 7 navigation items |
| SR-12 | routing.test.tsx | active state (manual verify ใน browser) |
| SR-13 | CoinCounter.test.tsx | displays value / red when negative |
| SR-14 | routing.test.tsx | renders Dashboard/Goals/etc per route |
| SR-15 | PageHeader.test.tsx | renders greeting / title / subtitle / action |
| SR-16 | routing.test.tsx | renders correct page per route |
| SR-17 | routing.test.tsx | correct heading per route |
