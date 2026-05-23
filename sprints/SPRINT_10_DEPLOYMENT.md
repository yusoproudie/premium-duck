# Sprint 10 — Deployment + CI/CD
> ISO 29110 Phase: **Software Implementation — Product Delivery** | TDD Phase: **Smoke Tests in Production**

---

## Sprint Info

| Field | Detail |
|---|---|
| Duration | 2–3 วัน |
| Sprint Goal | Deploy Premium Duck ขึ้น Google Cloud Run พร้อม CI/CD pipeline ครบวงจร |
| Depends On | Sprint 09 ผ่าน DoD |
| Status | Not Started |
| Branch | `sprint/10-deployment` |

---

## ISO 29110 — Version Description (VD)

| Field | Detail |
|---|---|
| Product | Premium Duck |
| Version | 1.0.0 |
| Release Type | MVP — Initial Release |
| Platform | Google Cloud Run |
| Build | React + TypeScript (CRA) → Nginx Docker container |

---

## Tasks

### Phase A: Production Build Verification

- [ ] **A1** — Build production bundle
  ```bash
  npm run build
  ```
  ตรวจ:
  - ไม่มี TypeScript error
  - Bundle size main < 300KB gzipped
  - ไม่มี unused imports (warning)

- [ ] **A2** — Test production build locally ด้วย Docker
  ```bash
  docker build -t premium-duck .
  docker run -p 8080:80 premium-duck
  # เปิด http://localhost:8080
  ```

- [ ] **A3** — Smoke test manual: ทุก page โหลดได้ใน Docker container

---

### Phase B: Google Cloud Run Setup

- [ ] **B1** — Setup Google Cloud Project (ถ้ายังไม่มี)
  ```bash
  gcloud projects create premium-duck-[your-id]
  gcloud config set project premium-duck-[your-id]
  gcloud services enable run.googleapis.com
  gcloud services enable artifactregistry.googleapis.com
  ```

- [ ] **B2** — สร้าง Artifact Registry repository
  ```bash
  gcloud artifacts repositories create premium-duck \
    --repository-format=docker \
    --location=asia-southeast1 \
    --description="Premium Duck Docker images"
  ```

- [ ] **B3** — Push Docker image ครั้งแรก (manual)
  ```bash
  docker tag premium-duck asia-southeast1-docker.pkg.dev/[PROJECT_ID]/premium-duck/app:v1.0.0
  docker push asia-southeast1-docker.pkg.dev/[PROJECT_ID]/premium-duck/app:v1.0.0
  ```

- [ ] **B4** — Deploy ไป Cloud Run
  ```bash
  gcloud run deploy premium-duck \
    --image=asia-southeast1-docker.pkg.dev/[PROJECT_ID]/premium-duck/app:v1.0.0 \
    --platform=managed \
    --region=asia-southeast1 \
    --allow-unauthenticated \
    --port=80 \
    --memory=256Mi \
    --max-instances=3
  ```

- [ ] **B5** — ทดสอบ URL ที่ได้จาก Cloud Run

---

### Phase C: CI/CD Pipeline (GitHub Actions — Full)

อัปเดต `.github/workflows/ci.yml` ให้ครบวงจร:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: asia-southeast1
  REPOSITORY: premium-duck
  SERVICE: premium-duck

jobs:
  # ─── Job 1: Test ──────────────────────────────────────────
  test:
    name: Unit Tests + Coverage
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --watchAll=false --coverage --coverageThreshold='{"global":{"lines":75}}'
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  # ─── Job 2: Build ─────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: build/

  # ─── Job 3: E2E (PR only) ─────────────────────────────────
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: build/
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  # ─── Job 4: Deploy (main branch + tags only) ──────────────
  deploy:
    name: Deploy to Cloud Run
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/v')
    permissions:
      contents: read
      id-token: write  # สำหรับ Workload Identity Federation

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker ${{ env.REGION }}-docker.pkg.dev

      - name: Build and Push Docker image
        run: |
          IMAGE="${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/app"
          TAG="${{ github.sha }}"
          docker build -t "$IMAGE:$TAG" -t "$IMAGE:latest" .
          docker push "$IMAGE:$TAG"
          docker push "$IMAGE:latest"

      - name: Deploy to Cloud Run
        run: |
          IMAGE="${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/app:${{ github.sha }}"
          gcloud run deploy ${{ env.SERVICE }} \
            --image="$IMAGE" \
            --platform=managed \
            --region=${{ env.REGION }} \
            --allow-unauthenticated \
            --port=80 \
            --memory=256Mi \
            --max-instances=3

      - name: Get Service URL
        run: |
          URL=$(gcloud run services describe ${{ env.SERVICE }} \
            --region=${{ env.REGION }} \
            --format='value(status.url)')
          echo "Deployed to: $URL"
```

> **Workload Identity Federation แทน Service Account Key:**
> เป็น Google best practice — ไม่ต้องเก็บ JSON key ใน GitHub Secrets
> Setup: [Google documentation](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions)

---

### Phase D: GitHub Secrets Setup

| Secret | Value |
|---|---|
| `GCP_PROJECT_ID` | Google Cloud project ID |
| `WIF_PROVIDER` | Workload Identity Federation provider |
| `WIF_SERVICE_ACCOUNT` | Service account email |

---

### Phase E: Nginx Config (ป้องกัน React Router 404)

สร้าง `nginx.conf` ในรูท project:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # สำหรับ React Router — ทุก route ส่งกลับ index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable caching for index.html
    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}
```

อัปเดต `Dockerfile`:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Phase F: Post-Deployment Smoke Tests

หลัง deploy สำเร็จ — ทดสอบ URL จริง:

```typescript
// e2e/smoke.spec.ts — รันหลัง deploy
import { test, expect } from '@playwright/test';

const PROD_URL = process.env.PROD_URL || 'http://localhost:3000';

test.describe('Production Smoke Tests', () => {
  test('app loads without error', async ({ page }) => {
    await page.goto(PROD_URL);
    await expect(page).toHaveTitle(/Premium Duck/);
    // ไม่มี error overlay
    await expect(page.locator('[data-testid="error-overlay"]')).not.toBeVisible();
  });

  test('all 7 routes load', async ({ page }) => {
    const routes = ['/', '/goals', '/daily-log', '/templates', '/rewards', '/analytics', '/settings'];
    for (const route of routes) {
      await page.goto(`${PROD_URL}${route}`);
      // ไม่มี 404 text
      await expect(page.locator('body')).not.toContainText('404');
    }
  });
});
```

---

## Output Artifacts (ISO 29110 — Product Delivery)

- [ ] Docker image ใน Google Artifact Registry
- [ ] Cloud Run service พร้อม public URL
- [ ] CI/CD pipeline ทำงานสมบูรณ์ (test → build → e2e → deploy)
- [ ] `nginx.conf` — React Router support
- [ ] Smoke test ผ่านบน production URL

---

## Definition of Done (DoD) — Sprint 10

- [ ] `docker build` + `docker run` ทำงานใน local
- [ ] Cloud Run URL เปิดได้ในมือถือ
- [ ] ทุก route ไม่มี 404 เมื่อ refresh ใน browser
- [ ] CI/CD: push ไป main → auto deploy ภายใน 5 นาที
- [ ] Smoke test ผ่านบน production URL
- [ ] Project ถูก tag v1.0.0 ใน git

---

## ISO 29110 — Project Closure Checklist

หลัง Sprint 10 สมบูรณ์:

- [ ] ทุก Sprint branch ถูก merge ไป main
- [ ] PREMIUM_DUCK_DEVELOPMENT_PLAN.md อัปเดต status เป็น "Released v1.0.0"
- [ ] Progress tracker อัปเดต learning outcomes
- [ ] Retrospective: เขียนสิ่งที่เรียนรู้ 3 อย่างจากโปรเจ็กต์นี้
- [ ] Portfolio: เพิ่มโปรเจ็กต์นี้ใน README ของ GitHub profile

---

## What You Learned — Summary Template

กรอกหลัง project complete:

```markdown
## Premium Duck — What I Learned

### Technical
1. TDD cycle: RED → GREEN → REFACTOR ใน React context
2. React Context + useReducer สำหรับ complex state
3. CI/CD ด้วย GitHub Actions + Cloud Run
4. localStorage versioning + migration pattern
5. Testing recharts ด้วย jest.mock

### Senior Mindset
1. Business logic แยกออกจาก component → testable และ reusable
2. Custom render wrapper ลด boilerplate ใน test
3. Workload Identity Federation แทน Service Account Key (security best practice)

### What I'd Do Differently
1. ...
2. ...
```
