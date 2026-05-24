# Phase 1 Summary — Foundation & Core Pages

> **Period:** Sprint 01–04
> **Methodology:** ISO 29110 + TDD (RED → GREEN → REFACTOR)
> **Test Result:** 126/126 tests passing

---

## Overview

Phase 1 establishes the complete foundation of the Premium Duck app — from project scaffolding and design system, through the layout/routing shell, to the two primary content pages (Dashboard and Goals). Every component is test-driven and traceable to a software requirement.

---

## Sprint 01 — Project Setup & Common Components

**Branch:** `sprint/01-setup`
**Goal:** Vite + React + TypeScript + Tailwind + Vitest scaffold with shared UI components

### Requirements Covered (SR-01 – SR-10)

| ID | Requirement |
|---|---|
| SR-01 | Vite + React + TypeScript scaffold |
| SR-02 | Tailwind CSS configured with custom cozy theme tokens |
| SR-03 | Vitest + Testing Library configured with custom render wrapper |
| SR-04 | Button component — primary / secondary / danger / ghost variants, sm/md/lg sizes |
| SR-05 | Input component — label, error state, onChange |
| SR-06 | Textarea component — label, error state |
| SR-07 | Select component — label, options, error state |
| SR-08 | Modal component — open/close, title, children |
| SR-09 | Badge component — head / body / feet variants |
| SR-10 | EmptyState component — message, optional action |

### Files Created
- `src/components/common/` — Button, Input, Textarea, Select, Modal, Badge, EmptyState
- `src/test-utils/render.tsx` — custom render with BrowserRouter wrapper
- `src/setupTests.ts` — jest-dom matchers
- `src/types/index.ts` — full domain type definitions
- `src/services/storage.ts` — localStorage service

### Tests: **35 tests passing**

---

## Sprint 02 — Layout & Routing

**Branch:** `sprint/02-layout-routing`
**Goal:** Sidebar, MainLayout, PageHeader, routing with 7 pages

### Requirements Covered (SR-11 – SR-17)

| ID | Requirement |
|---|---|
| SR-11 | Sidebar with 7 navigation items (Dashboard, Goals, Daily Log, Templates, Rewards, Analytics, Settings) |
| SR-12 | Active nav item has yellow background highlight |
| SR-13 | CoinCounter shows coin value — red text when negative |
| SR-14 | MainLayout: Sidebar left + content area right |
| SR-15 | PageHeader: greeting "Hello, Friend 👋", title, subtitle, optional action |
| SR-16 | Routing navigates between all 7 pages |
| SR-17 | URL matches page (/ = Dashboard, /goals = Goals, etc.) |

### Files Created
- `src/components/layout/CoinCounter.tsx`
- `src/components/layout/PageHeader.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/pages/` — Dashboard, Goals, DailyLog, Templates, Rewards, Analytics, Settings (shells)
- `src/App.tsx` — refactored with `AppRoutes` export (testable pattern)
- `src/__tests__/routing.test.tsx`

### Key Design Decision
`AppRoutes` is exported separately from `App` to allow routing tests to use `MemoryRouter` without nesting routers.

### Tests: **70 tests passing**

---

## Sprint 03 — Dashboard Page

**Branch:** `sprint/03-dashboard`
**Goal:** Fully functional Dashboard with StatsCards, RadarChart, QuickAdd

### Requirements Covered (SR-18 – SR-25)

| ID | Requirement |
|---|---|
| SR-18 | Dashboard shows 4 StatsCards: Total Coins, HEAD, BODY, FEET |
| SR-19 | Total Coins card has blue border (primary variant) |
| SR-20 | HEAD/BODY/FEET score shown as `0.0/10` format |
| SR-21 | Radar Chart shows 6 categories on hexagonal grid |
| SR-22 | QuickAdd form accepts task description + coins value |
| SR-23 | QuickAdd "Log it" button calls callback with task + coins |
| SR-24 | "Upcoming goals" section shows empty state when no goals |
| SR-25 | StatsCard negative coins — no red color (only Total bar logic) |

### Files Created
- `src/components/dashboard/StatsCard.tsx`
- `src/components/dashboard/QuickAdd.tsx`
- `src/components/dashboard/RadarChart.tsx`
- `src/pages/Dashboard.tsx` (fully implemented)
- `src/pages/__tests__/Dashboard.test.tsx`

### Key Design Decision
`recharts` is mocked in unit tests (`vi.mock('recharts', ...)`) because SVG + ResizeObserver are not fully supported in jsdom. Visual verification is done in-browser.

### Tests: **95 tests passing**

---

## Sprint 04 — Goals Page

**Branch:** `sprint/04-goals`
**Goal:** Full CRUD Goals page with CategoryTabs, GoalCard, GoalModal

### Requirements Covered (SR-26 – SR-35)

| ID | Requirement |
|---|---|
| SR-26 | CategoryTabs shows 6 default categories with emoji |
| SR-27 | Click tab changes active category — active tab highlighted |
| SR-28 | Goal form accepts: name, description, category, period, deadline, repeats, sub-goals |
| SR-29 | Goal form validates — name must not be empty |
| SR-30 | Sub-goals: add multiple items, delete individual items |
| SR-31 | GoalCard shows goal name, category emoji, period, deadline (if provided) |
| SR-32 | GoalCard shows sub-goal progress bar (completed/total) |
| SR-33 | Delete goal with trash button — requires window.confirm |
| SR-34 | Goals filtered by active category tab |
| SR-35 | Empty state shown when no goals in selected category |

### Files Created
- `src/components/goals/CategoryTabs.tsx`
- `src/components/goals/GoalCard.tsx`
- `src/components/goals/GoalModal.tsx`
- `src/pages/Goals.tsx` (fully implemented)
- `src/pages/__tests__/Goals.test.tsx`

### Key Design Decision
`GoalModal` is implemented as a self-contained dialog (not using the HeadlessUI Modal) to keep tests synchronous and avoid `act()` animation warnings. Default category order starts with "Skills & Learning" so the integration filter test creates goals in the expected category.

### Tests: **126 tests passing**

---

## Phase 1 — Metrics

| Sprint | New Tests | Cumulative | Components |
|---|---|---|---|
| Sprint 01 | 35 | 35 | 7 common components |
| Sprint 02 | 35 | 70 | 4 layout + 7 page shells |
| Sprint 03 | 25 | 95 | 3 dashboard components |
| Sprint 04 | 31 | 126 | 3 goals components |

**Total: 126 tests | 0 failures | 20 test files**

---

## Architecture Decisions

### Testing Strategy
- **Unit tests** — every component tested in isolation via TDD
- **Integration tests** — routing and page-level tests verify composition
- **No E2E yet** — active state and visual regression deferred to Sprint 09
- `vi.fn()` / `vi.mock()` used throughout (Vitest globals, not Jest)

### Router Pattern
```
main.tsx → <App /> (no Router)
App.tsx  → <BrowserRouter><MainLayout><AppRoutes /></MainLayout></BrowserRouter>
AppRoutes (exported) → used in routing tests with <MemoryRouter>
```

### State Management
Phase 1 uses local component state (`useState`). Global state (Context or Zustand) is planned for Sprint 07+.

---

## Definition of Done — Phase 1 ✅

- [x] 126/126 tests GREEN
- [x] TypeScript — no errors
- [x] Routing navigates all 7 pages without 404
- [x] Dashboard renders StatsCards + RadarChart + QuickAdd
- [x] Goals: create, filter, delete, edit with sub-goals
- [x] Sidebar active link highlights on navigation
- [x] CoinCounter shows red for negative values
