# Sprint 00 — Project Initiation & Setup
> ISO 29110 Phase: **Project Management — Initiation** | TDD Phase: **Infrastructure**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 2–3 วัน |
| Sprint Goal | Setup สภาพแวดล้อม, เอกสาร ISO 29110, และ Testing Infrastructure ให้พร้อมก่อนเขียนโค้ดจริง |
| Status | Not Started |
| Branch | `sprint/00-project-initiation` |

---

## ISO 29110 — Project Plan (PP)

### 1. Project Overview

| Field | Detail |
|---|---|
| Project Name | Premium Duck |
| Version | 1.0.0 |
| Start Date | (ใส่วันที่เริ่มจริง) |
| End Date | (เป้าหมาย 6–8 สัปดาห์) |
| Developer | Punyanuch Hataiwaseewong |
| Methodology | Scrum-lite + TDD + ISO 29110 Basic Profile |

### 2. Work Breakdown Structure (WBS)

```
Premium Duck 1.0
├── Sprint 00 — Initiation & Setup
├── Sprint 01 — Types + Common Components
├── Sprint 02 — Layout + Routing
├── Sprint 03 — Dashboard
├── Sprint 04 — Goals Page
├── Sprint 05 — Daily Log Calendar
├── Sprint 06 — Templates + Rewards
├── Sprint 07 — Analytics + Settings
├── Sprint 08 — Data Persistence
├── Sprint 09 — Integration Testing + Polish
└── Sprint 10 — Deployment + CI/CD
```

### 3. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Scope creep (เพิ่ม feature ตลอด) | High | High | Freeze scope หลัง Sprint 00 — ทุก feature ใหม่ไปที่ backlog |
| Testing ข้าม (ไม่เขียน test ก่อน) | Medium | High | TDD เป็น Definition of Done — PR merge ไม่ได้ถ้าไม่มี test |
| localStorage พังเมื่อ schema เปลี่ยน | Medium | Medium | วาง versioning ตั้งแต่ Sprint 00 |
| Deploy ล้มเหลว late game | Low | High | Test CI/CD pipeline ตั้งแต่ Sprint 00 (ด้วย empty app) |

### 4. Configuration Management Plan

```
branch naming:
  sprint/00-project-initiation
  sprint/01-common-components
  feature/[sprint-number]-[feature-name]   ← branch ย่อยใน sprint
  fix/[description]

commit format:
  feat(sprint-01): add Button component with variants
  test(sprint-01): add Button unit tests
  fix(sprint-02): fix sidebar active state
  docs(sprint-00): add project plan

merge policy:
  - ทุก sprint branch → main ผ่าน PR
  - PR ต้องผ่าน: npm test (all green) + npm run build (no errors)
```

---

## Input Artifacts (ISO 29110)

- [x] `PREMIUM_DUCK_DEVELOPMENT_PLAN.md` — ข้อกำหนดหลัก
- [x] `about-pair/PROFILE.md` — Developer profile
- [ ] Sprint files นี้ (output ของ Sprint 00)

---

## Tasks

### Phase A: สร้าง React App + Dependencies

- [ ] **A1** — สร้าง React app ด้วย TypeScript template
  ```bash
  npx create-react-app premium-duck --template typescript
  cd premium-duck
  ```

- [ ] **A2** — Install production dependencies
  ```bash
  npm install react-router-dom@6 @headlessui/react lucide-react clsx recharts date-fns react-hook-form
  ```

- [ ] **A3** — Install Tailwind CSS
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- [ ] **A4** — Install **Testing dependencies** (TDD core)
  ```bash
  npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
  npm install -D @testing-library/dom jest-environment-jsdom
  ```
  > CRA มาพร้อม Jest แล้ว — แค่ต้องเพิ่ม @testing-library/user-event และ jest-dom

- [ ] **A5** — Setup Tailwind config (copy จาก PREMIUM_DUCK_DEVELOPMENT_PLAN.md Phase 1)

- [ ] **A6** — สร้าง folder structure ครบ
  ```
  src/
  ├── components/
  │   ├── common/
  │   ├── layout/
  │   ├── dashboard/
  │   ├── goals/
  │   ├── dailyLog/
  │   ├── templates/
  │   ├── rewards/
  │   ├── analytics/
  │   └── settings/
  ├── pages/
  ├── hooks/
  ├── services/
  ├── types/
  ├── utils/
  ├── contexts/
  └── __tests__/        ← folder หลักสำหรับ integration tests
  ```

### Phase B: Testing Infrastructure Setup

- [ ] **B1** — สร้าง `src/setupTests.ts` (CRA สร้างให้แล้ว แต่ verify)
  ```typescript
  import '@testing-library/jest-dom';
  ```

- [ ] **B2** — สร้าง `src/test-utils/render.tsx` — custom render wrapper
  ```typescript
  import { render, RenderOptions } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import { ReactElement } from 'react';

  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <BrowserRouter>{children}</BrowserRouter>;
  };

  const customRender = (ui: ReactElement, options?: RenderOptions) =>
    render(ui, { wrapper: AllProviders, ...options });

  export * from '@testing-library/react';
  export { customRender as render };
  ```
  > ทำไม: ทุก component ที่ใช้ router hooks (useNavigate, NavLink) ต้องอยู่ใน BrowserRouter
  > การ wrap ใน custom render ทำให้ไม่ต้อง wrap ซ้ำในทุก test

- [ ] **B3** — เขียน smoke test แรก (TDD เริ่มต้น)
  ```typescript
  // src/__tests__/App.test.tsx
  import { render, screen } from '../test-utils/render';
  import App from '../App';

  test('renders without crashing', () => {
    render(<App />);
    // ถ้า render ไม่พัง test ผ่าน
  });
  ```

- [ ] **B4** — รัน `npm test` — ต้อง GREEN ก่อนไปต่อ

### Phase C: Git Setup + CI/CD Skeleton

- [ ] **C1** — `git init` และ commit แรก
  ```bash
  git init
  git add .
  git commit -m "feat(sprint-00): initial project setup with CRA + TypeScript"
  ```

- [ ] **C2** — สร้าง `.github/workflows/ci.yml` (CI pipeline skeleton)
  ```yaml
  name: CI

  on:
    push:
      branches: [main, 'sprint/*']
    pull_request:
      branches: [main]

  jobs:
    test-and-build:
      runs-on: ubuntu-latest

      steps:
        - uses: actions/checkout@v4

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '20'
            cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Run tests
          run: npm test -- --watchAll=false --coverage

        - name: Build
          run: npm run build
  ```
  > ทำไม CI ตั้งแต่ Sprint 00: เพื่อ catch breaking changes ทุก push — ไม่รอให้ถึง deploy แล้วค่อยแก้

- [ ] **C3** — สร้าง `Dockerfile` skeleton
  ```dockerfile
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=build /app/build /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```

- [ ] **C4** — สร้าง `.gitignore` ครอบคลุม
  ```
  node_modules/
  build/
  coverage/
  .env
  .env.local
  .DS_Store
  ```

### Phase D: localStorage Versioning (ป้องกัน schema พัง)

- [ ] **D1** — สร้าง `src/services/storage.ts` skeleton พร้อม version
  ```typescript
  export const STORAGE_VERSION = '1.0.0';
  export const STORAGE_KEY = 'premium-duck-data';

  export interface StorageSchema {
    version: string;
    // จะเพิ่ม fields ใน Sprint 08
  }

  export const initStorage = (): void => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: STORAGE_VERSION,
      }));
    }
    // Migration logic จะมาใน Sprint 08
  };
  ```

---

## Output Artifacts (ISO 29110)

- [ ] React app พร้อม TypeScript — รัน `npm start` ได้ไม่มี error
- [ ] Testing infrastructure — `npm test` ผ่าน smoke test
- [ ] Git repository พร้อม branch strategy
- [ ] `.github/workflows/ci.yml` — CI pipeline
- [ ] `Dockerfile` skeleton
- [ ] Sprint files 00–10 (document นี้และ files อื่น)

---

## Definition of Done (DoD) — Sprint 00

- [ ] `npm start` — แสดง default React page ไม่มี console error
- [ ] `npm test` — ผ่านทุก test (GREEN)
- [ ] `npm run build` — build สำเร็จไม่มี error
- [ ] Git repository มี commit แรก
- [ ] CI workflow file อยู่ใน `.github/workflows/`
- [ ] Sprint files 01–10 สร้างแล้วครบ
- [ ] ทีม (ตัวเอง) เข้าใจ TDD cycle: RED → GREEN → REFACTOR

---

## TDD คืออะไร — Quick Reference

```
🔴 RED    → เขียน test ที่ fail ก่อน (component ยังไม่มี)
🟢 GREEN  → เขียนโค้ด minimum ที่สุดให้ test ผ่าน
🔵 REFACTOR → clean up โค้ดโดยไม่ให้ test พัง
```

**กฎ TDD:**
1. ห้ามเขียน production code โดยไม่มี failing test รออยู่
2. เขียน test แค่พอให้ fail (compile error นับว่า fail)
3. เขียน production code แค่พอให้ test ผ่าน

---

## ISO 29110 — Sprint Review Checklist

ทำทุกสิ้น sprint:
- [ ] Output artifacts ครบตามที่ระบุ
- [ ] Definition of Done ผ่านทุกข้อ
- [ ] Update progress tracker ใน `being-senior/vault/05-Learning-Log/progress-tracker.md`
- [ ] Commit + merge sprint branch → main ผ่าน PR
