# Gifty

Existing Next.js 16 / React 19 gifting frontend, with a separate Express / TypeScript / Prisma / MySQL backend foundation.

## Current scope

Phase 0 audit is recorded in [docs/phase-0](docs/phase-0/audit-report.md). Phase 1 adds backend infrastructure and repairs frontend runtime/lint/responsiveness prerequisites. Commerce integration remains in later approval-gated phases. The storefront still uses development fixtures; it is not ready for production commerce. Simulated login, checkout success and newsletter subscription success are disabled in production builds.

## Local development

Use Node 22.14+ (22.x) or Node 24+. From the root:

```powershell
npm ci
npm --prefix server ci
npm run dev
```

The storefront runs on http://localhost:3000. Follow [server/README.md](server/README.md) to configure isolated MySQL development/test databases, generate Prisma, apply migrations, seed and start the backend. Backend defaults to http://127.0.0.1:5000.

```powershell
npm run dev:server
```

Use separate terminal windows for each process. Configure secrets only in ignored environment files; commit only templates. `compose.yaml` supplies optional local MySQL services. This session also has an isolated native MySQL database under ignored `.local/phase-1`; it is not part of the repository distribution.

## Checks

```powershell
npm run typecheck
npm run lint
npm run build
npm run check:server
npm --prefix server run db:migrate:test
npm --prefix server run test:db
```

Browser tests (frontend must already be running):

```powershell
cd server
npx playwright install chromium
npm run test:e2e
```

For installed Edge on Windows, set `$env:PLAYWRIGHT_CHANNEL='msedge'` instead of downloading Chromium. `FRONTEND_TEST_URL` can select a different local test address. To verify production safety guards, build the frontend and run `npm start -- --port 3100` at the root; then set `FRONTEND_TEST_URL=http://localhost:3100` and run `npm run test:e2e:production` in `server/`.

## Design preservation

Keep the existing Playfair Display typography and cream/green/gold visual identity. Source instructions in AGENTS.md require reading the installed Next.js documentation before framework changes. Phase 0 screenshots are the original visual baseline. Responsive grid fixes are intentional; unrelated styling must remain unchanged.

## Approval gates

Only proceed one phase at a time. Each phase requires actual test/audit evidence and explicit owner approval. See [architecture plan](docs/phase-0/architecture-plan.md) for scope and [Phase 1 audit](docs/phase-1/audit-report.md) for results and limitations. Do not deploy the frontend demo as a functioning shop.
"# gift-seller" 
