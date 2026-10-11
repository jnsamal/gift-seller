# Gifty backend — Phase 1

Express 5 + strict TypeScript + Prisma 7 + MySQL. Only health and OpenAPI endpoints exist in this phase. Catalog, session, customer and administrative routes will be added in later approved phases. The frontend is not yet integrated with this API.

## Setup

Use Node 22.14+ (22.x) or Node 24+ and npm. From the repository root:

```powershell
npm ci
npm --prefix server ci
Copy-Item server/.env.example server/.env
```

Set real local values in `server/.env`. Never commit this file. `DATABASE_URL` and `TEST_DATABASE_URL` must point at different databases and use URL-encoded credentials. Test database name must end in `_test`. The runtime URL intentionally rejects query parameters; use `DATABASE_TLS` and `DATABASE_CA_FILE`. Production requires `DATABASE_TLS=true` and an HTTPS `FRONTEND_URL`. The Prisma CLI maps these TLS settings to `sslaccept=strict` and the optional trusted CA. TLS production connectivity is not verified by a loopback test.

For Docker (if installed), copy the root `.env.example` to `.env`, set all four random `MYSQL_*_PASSWORD` values, then run:

```powershell
docker compose --profile test up -d --wait
```

Development MySQL uses localhost:3307, test uses localhost:3308. Both use isolated persistent volumes and loopback-only port bindings. Set the corresponding URLs in `server/.env`. Docker Compose is provided but was not executed in this Windows environment; actual verification used an isolated native MySQL 8.0.39 instance on port 3317. MySQL >=8.0.16 is required for enforced CHECK constraints; MySQL 8.4 is the Compose target.

Then, in `server/`:

```powershell
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:migrate:test
npm run db:seed
npm run dev
```

Run frontend `npm run dev` from another terminal at the root. For a separate production-build preview on port 3100, run `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100` from the root after `npm run build`. Backend defaults to http://127.0.0.1:5000. No credential or private API URL is exposed through a public frontend environment variable.

## Configuration

| Variable | Purpose |
|---|---|
| NODE_ENV | development/test/production; production requires verified database TLS and frontend HTTPS |
| HOST / PORT | Listening interface and port; local default 127.0.0.1:5000; explicitly configure container binding |
| FRONTEND_URL | Exact allowed HTTP(S) origin; no trailing path, wildcard or credentials |
| DATABASE_URL | MySQL runtime/migration connection; use dedicated migration identity for deployments |
| TEST_DATABASE_URL | Separate database ending `_test`; never falls back to DATABASE_URL |
| DATABASE_TLS / DATABASE_CA_FILE | Verify database certificates; optional CA PEM path; no rejectUnauthorized=false option |
| DB_CONNECTION_LIMIT | Pool size, default 5, bounded 1–30 |
| LOG_LEVEL | Pino level; never log request bodies, query strings, cookies, SQL or configuration |
| RATE_LIMIT_MAX / RATE_LIMIT_WINDOW_MS | Per-process API rate limit; defaults 120/minute |
| TRUST_PROXY_HOPS | Defaults 0; configure only when exact trusted proxy hop topology is known |

The current in-memory rate limiter is suitable for one process; shared limits must be introduced before multiple instances. Origin checks protect the current browser mutation boundary, but are not session authentication or complete CSRF protection. No state-changing API is exposed yet. Phase 3 adds sessions, token-based CSRF and authorization. Razorpay's future signed raw-body webhook route must precede JSON parsing and use a narrowly scoped exception to browser Origin rules.

## Validation

```powershell
npm run typecheck
npm run lint
npm test
npm run db:migrate:test
npm run test:db
npm run build
npm start
```

`npm test` runs configuration, HTTP and frontend safety prerequisites without requiring a database. `test:db` requires real migrated MySQL and fails if the dedicated test URL is missing/unsafe. It verifies seed repeatability, constraints, rollback, Unicode, exact integer prices, order snapshots and restrictive deletion. It does not validate payment or overselling workflows, which belong to Phase 7. Do not point it at customer data.

Endpoints:

- `GET /api/v1/health/live`: process liveness, does not depend on the database.
- `GET /api/v1/health/ready`: bounded `SELECT 1` dependency probe, returns 503 if unavailable. Deployment must apply migrations before startup; readiness alone does not assert schema version.
- `GET /api/v1/openapi.json`: OpenAPI 3.1 scaffold for implemented endpoints only.

Health endpoints reject unexpected query parameters. Responses contain a server-generated request ID. Unknown APIs return 404; errors expose stable codes and safe messages. Startup fails on invalid configuration or unavailable database. SIGTERM/SIGINT drain connections and disconnect Prisma with a 10-second shutdown deadline.

## Schema and migration policy

The first migration creates 25 foundation tables spanning identity, catalog/media, inventory, order/payment history and settings/auditing. Future phases extend these models; their existence does not mean the corresponding feature is implemented. Data uses utf8mb4, UTC timestamps, integer paise, unique identifiers and explicit foreign-key deletion rules. Uploaded binaries are never stored in MySQL. CHECK constraints additionally protect reserved stock, quantities, payment/refund amounts and order arithmetic.

Development seeds are transactional and create-only: two role definitions (no users/admin credentials), a draft sample product/default SKU, category, location, inventory and timezone setting. Reseeding must not reset prices/stock or publish development fixtures. The seed CLI refuses NODE_ENV=production.

Use `db:migrate:dev` only on a disposable developer database when authoring a new migration; it can require a separate shadow database/user. Review generated SQL and add supported CHECK constraints explicitly. Commit migration directories and lockfiles. Never edit a migration after it is deployed. `db:migrate` uses non-resetting `migrate deploy`; it does not erase databases. Test fresh and existing-database application in an isolated environment before deployment. No automatic destructive rollback command is supplied.

Production requires a managed MySQL instance, verified TLS, a schema-limited migration account, a separate least-privilege runtime account, backups, a tested restore procedure and an authenticated operational deployment process. Before migration, take a recoverable backup and verify compatibility with the previous application version. Restore into a new instance for recovery or deploy a reviewed forward repair. Do not run `migrate reset` or `db push --force-reset` against production.

## Dependency decisions

Prisma 7.10.0 was selected instead of npm's Prisma 8 release candidate for compatibility with the installed Node 22.14 runtime. Its MySQL adapter uses the MariaDB Node driver while the database remains MySQL. Overrides pin patched mariadb 3.5.4, mysql2 3.24.5 and deepmerge-ts 8.0.2; retain until the upstream dependency tree includes safe versions. The install audit initially reported six vulnerabilities and reported zero after patches; re-audit on dependency changes. Actual generation, migration, Prisma queries and tests verify the override combination. Package lockfiles pin resolved versions.

Provider credentials for Cloudinary, Razorpay and email/SMS are not required or read by this phase. They must be added and verified in their designated phases. This foundation is not a production launch approval.

Official references reviewed: [Prisma MySQL setup](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/mysql), [Express 5 error handling](https://expressjs.com/en/5x/guide/error-handling/). Next.js changes follow the installed `node_modules/next/dist/docs/` image and component guides.
