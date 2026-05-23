# Sprint 09 — Integration Testing + Polish
> ISO 29110 Phase: **Software Implementation — Integration and Testing** | TDD Phase: **E2E + Regression**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 5–7 วัน |
| Sprint Goal | E2E tests สำหรับ golden paths, responsive design, error handling, performance polish |
| Depends On | Sprint 08 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/09-testing-polish` |

---

## ISO 29110 — Test Plan (SI.4)

### Test Strategy

| Level | Tool | Scope |
|---|---|---|
| Unit | Jest + RTL | Components, utils, reducer (Sprint 01–08) |
| Integration | Jest + RTL | Page flows, context interactions |
| E2E | Playwright | Golden paths end-to-end |
| Visual | Manual + browser | Responsive, mobile, cross-browser |

### Test Coverage Targets

| Area | Target |
|---|---|
| Utils (business logic) | ≥ 90% |
| Components | ≥ 80% |
| Pages (integration) | ≥ 70% |
| Overall | ≥ 75% |

---

## Tasks

### Phase A: Setup Playwright (E2E)

- [ ] **A1** — Install Playwright
  ```bash
  npm init playwright@latest
  # เลือก TypeScript, tests/ folder, GitHub Actions
  ```

- [ ] **A2** — สร้าง `playwright.config.ts`
  ```typescript
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    use: {
      baseURL: 'http://localhost:3000',
      trace: 'on-first-retry',
    },
    webServer: {
      command: 'npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
    },
  });
  ```

---

### Phase B: E2E Golden Paths

#### Golden Path 1: Log a task and see coins update

สร้าง `e2e/daily-log.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Daily Log — Golden Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage ก่อนแต่ละ test
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('user can log a task and see coins increase', async ({ page }) => {
    // Navigate to Daily Log
    await page.click('text=Daily Log');
    await expect(page).toHaveURL('/daily-log');

    // Click today's date
    const today = new Date().getDate().toString();
    await page.click(`button:has-text("${today}")`);

    // Fill task
    await page.fill('input[placeholder="What did you do?"]', 'Morning run');
    await page.click('button:has-text("Add task")');

    // Save
    await page.click('button:has-text("Save")');

    // Navigate to Dashboard and check coins
    await page.click('text=Dashboard');
    await expect(page.locator('[data-testid="total-coins"]')).toContainText('5');
  });
});
```

#### Golden Path 2: Create goal and track progress

สร้าง `e2e/goals.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Goals — Golden Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/goals');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('user can create a goal and see it in the list', async ({ page }) => {
    await page.click('button:has-text("New goal")');

    // Fill form
    await page.fill('input[name="name"]', 'Learn Playwright');
    await page.click('button:has-text("Save goal")');

    // Goal should appear
    await expect(page.locator('text=Learn Playwright')).toBeVisible();
  });

  test('user can delete a goal', async ({ page }) => {
    // Create goal first
    await page.click('button:has-text("New goal")');
    await page.fill('input[name="name"]', 'Temp Goal');
    await page.click('button:has-text("Save goal")');

    // Delete with confirm
    page.on('dialog', dialog => dialog.accept());
    await page.click('[aria-label="Delete goal"]');
    await expect(page.locator('text=Temp Goal')).not.toBeVisible();
  });
});
```

#### Golden Path 3: Redeem reward

สร้าง `e2e/rewards.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Rewards — Golden Path', () => {
  test('user with enough coins can redeem a reward', async ({ page }) => {
    // Setup: เพิ่ม coins ก่อน (mock ผ่าน localStorage)
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('premium-duck-data', JSON.stringify({
        version: '1.0.0',
        userProfile: { id: '1', name: 'Test', totalCoins: 200, createdAt: new Date() },
        categories: [],
        goals: [],
        logEntries: [],
        templates: [],
        rewards: [{
          id: 'r1',
          name: 'Coffee',
          description: 'Treat',
          emoji: '☕',
          cost: 50,
          createdAt: new Date(),
        }],
        redemptionHistory: [],
      }));
    });
    await page.reload();
    await page.goto('/rewards');

    await page.click('button:has-text("Redeem")');

    // Coins should decrease
    await expect(page.locator('[data-testid="sidebar-coins"]')).toContainText('150');
  });
});
```

---

### Phase C: Responsive Design Testing

- [ ] **C1** — Test ใน Chrome DevTools: iPhone SE (375px), iPad (768px), Desktop (1280px)
- [ ] **C2** — Sidebar ต้อง collapse ใน mobile หรือ overlay — เพิ่ม hamburger menu ถ้าจำเป็น
- [ ] **C3** — Calendar grid ยังอ่านได้ใน 375px
- [ ] **C4** — Modal ไม่ overflow ใน small screen
- [ ] **C5** — Form inputs ไม่ zoom เมื่อ focus (iOS) — ตรวจ font-size ≥ 16px

### Phase D: Error Handling + Edge Cases

- [ ] **D1** — localStorage เต็ม (QuotaExceededError) → silently fail, แสดง warning toast
- [ ] **D2** — Goal deadline ที่ผ่านไปแล้ว → แสดง "overdue" badge
- [ ] **D3** — Empty name เมื่อ save profile → แสดง validation error
- [ ] **D4** — Negative coins display → สีแดง ทุก component ที่แสดง coins

### Phase E: Performance Polish

- [ ] **E1** — ตรวจ unnecessary re-renders ด้วย React DevTools Profiler
  > ควรใช้ `useMemo` สำหรับ filtered goals, `useCallback` สำหรับ handlers ที่ส่งลง children

- [ ] **E2** — ตรวจ bundle size: `npm run build` → ดู chunk sizes ใน build output
  > เป้าหมาย: main bundle < 300KB gzipped

- [ ] **E3** — Lazy load pages ด้วย `React.lazy`
  ```typescript
  const Dashboard = React.lazy(() => import('./pages/Dashboard'));
  ```

- [ ] **E4** — ตรวจ recharts ไม่ re-render โดยไม่จำเป็น → `memo` RadarChart wrapper

### Phase F: Accessibility (A11y)

- [ ] **F1** — ทุก interactive element มี accessible name (label, aria-label)
- [ ] **F2** — Tab order สมเหตุสมผล — navigate ด้วย keyboard ได้
- [ ] **F3** — Modal trap focus เมื่อเปิด — focus กลับมาเมื่อปิด
- [ ] **F4** — Color contrast ≥ WCAG AA (4.5:1 สำหรับ text)
- [ ] **F5** — ทดสอบด้วย Chrome Lighthouse → Accessibility score ≥ 85

### Phase G: Final Test Run

- [ ] **G1** — `npm test -- --coverage` → ดู coverage report
  ```bash
  npm test -- --watchAll=false --coverage --coverageReporters=text-summary
  ```
- [ ] **G2** — รัน Playwright E2E: `npx playwright test`
- [ ] **G3** — ไม่มี `console.error` หรือ `console.warn` ใน production

---

## Playwright + CI Integration

เพิ่มใน `.github/workflows/ci.yml`:

```yaml
  e2e:
    runs-on: ubuntu-latest
    needs: test-and-build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Output Artifacts (ISO 29110)

- [ ] `e2e/daily-log.spec.ts` ผ่าน
- [ ] `e2e/goals.spec.ts` ผ่าน
- [ ] `e2e/rewards.spec.ts` ผ่าน
- [ ] Test coverage report ≥ 75%
- [ ] Lighthouse report (Performance + Accessibility)
- [ ] Mobile screenshot evidence (3 breakpoints)

---

## Definition of Done (DoD) — Sprint 09

- [ ] `npm test` — ทุก unit test GREEN, coverage ≥ 75%
- [ ] `npx playwright test` — ทุก E2E ผ่าน
- [ ] Mobile (375px) — ทุก page ใช้งานได้
- [ ] Lighthouse Accessibility ≥ 85
- [ ] ไม่มี console.error ใน browser
- [ ] PR merged → main ผ่าน CI (unit + E2E)

---

## ISO 29110 — Test Report Template

กรอกหลัง sprint complete:

```markdown
## Test Report — Sprint 09

**Date:** ___
**Tester:** Punyanuch Hataiwaseewong

### Unit Tests
- Total: ___ tests
- Passed: ___
- Failed: ___
- Coverage: ___%

### E2E Tests
- Total: ___ tests
- Passed: ___
- Failed: ___

### Issues Found
| ID | Description | Severity | Status |
|---|---|---|---|
| BUG-01 | | | |

### Sign-off
- [ ] All critical bugs fixed
- [ ] Coverage target met
- [ ] Ready for Sprint 10 (Deployment)
```
