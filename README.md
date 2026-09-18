# TabShare

Shared expenses for trips, households, and small groups. Built with Next.js, React, Postgres, and Zod.

## What works

- Create a group with 2–12 members, then share its private invitation link.
- Log USD expenses and split them evenly among selected members.
- See a ledger, category filters, individual balances, and a suggested settlement plan.
- Explore `/groups/demo` without creating a group or connecting a database.
- Amounts are calculated in integer cents, including deterministic remainder distribution.

The settlement plan is a suggestion, not a payment service. TabShare does not transfer money or verify that a payment took place. The greedy settlement algorithm clears all balances but does not guarantee the fewest mathematically possible transfers.

## Access model

A group’s URL is its access credential: anyone holding it can read and add expenses. New URLs contain 192 bits of cryptographic randomness. Keep links private; there is no account recovery, per-person permission system, or individual member identity verification. Group pages are excluded from indexing and use a no-referrer policy. Avoid entering sensitive financial account information or credentials in notes.

**Existing deployment upgrade:** older name-based group links are rejected by this release. Before promoting it, back up Postgres, run `node --env-file=.env.local scripts/migrate-private-links.mjs` to inspect the migration count, then add `--apply` to replace legacy links. The script saves a private mapping with owner-only file permissions before making an atomic database update. Keep that report outside Git and share each replacement link only with its group. Old links intentionally do not redirect, because they were guessable. Existing expenses and member records are preserved. A rollback to the old app would reintroduce the old access weakness.

## Run locally

Node.js 22 or later:

```sh
npm ci
npm run dev:local
```

This starts an isolated in-memory PostgreSQL-compatible test database and the app at `http://localhost:3100`. Data disappears when stopped. It never connects to production.

For persistent Postgres, copy `.env.example` to `.env.local`, supply the connection string, then run `npm run dev`. Use `POSTGRES_URL` or `DATABASE_URL`; production connections require TLS.

## Verification

```sh
npm test
npm run dev:local
# In a second terminal:
npm run test:integration
npm run build
npm audit
```

Unit tests cover money conservation, settlement correctness, validation, private-link generation, and JSON request limits. Integration tests create disposable groups and expenses, verify persistence and page responses, and reject cross-group members and invalid inputs. They only target localhost. PGlite exercises PostgreSQL protocol/SQL behavior but is not a substitute for a staging smoke test against the actual hosted Postgres service.

## Deploy

Preserve the existing Vercel project and `tabshare.me` domain. Set `POSTGRES_URL` (or `DATABASE_URL`) for the target environment. The app ensures its additive schema on first access; apply the legacy-link migration before promotion. Verify `/api/health`, create a disposable staging group, add an uneven expense split, reload, and compare the settlement totals. Deploy a preview before promoting to production.

Database-backed write ceilings allow 100 new groups per hour across the app and 120 expenses per minute per group. Provider-level abuse protection can supplement these ceilings. Production release also requires database backups and recovery, and a completed hosted smoke test. These controls are not implied by a successful local build. Private links can be forwarded; use account-based access if your use case needs stronger privacy.

## API

- `GET /api/health`: database readiness, without internal error details.
- `POST /api/groups`: create a group (`name`, `purpose`, `memberNames`).
- `GET /api/groups/:slug`: group snapshot; private, non-cacheable response.
- `POST /api/groups/:slug/expenses`: add an expense (`title`, `amount`, `category`, `spentOn`, `payerMemberId`, `participantIds`, optional `notes`).

JSON payloads are limited to 16 KB. Invalid payloads return 400; unsupported content types return 415; oversized payloads return 413. Service failures return 503. Both forms and API writes use server validation and transactions.

## Project background

Created by Simon East for a Babson course with assistance from OpenAI Codex. This redesign focuses on a useful, understandable product experience, explicit access boundaries, and verifiable expense calculations.
