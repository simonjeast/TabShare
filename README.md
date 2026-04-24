# TabShare

TabShare is a routed, full-stack expense sharing app for trips, roommates, and collaborative budgets. It is built as a Next.js application with server-side persistence, page routing, and a Postgres-backed backend that can be deployed on Vercel.

## Live Demo URL

Add your deployed Vercel URL here after deployment, for example:

`https://tabshare-your-team.vercel.app`

## What It Does

Users create a workspace for a trip or group, add members, record shared expenses, review a full ledger, and finish with a settlement plan that minimizes the number of payments required.

## UX Flow

The app is structured around the actual user journey instead of one overloaded dashboard:

1. `/groups/new`
Create a workspace with a name, purpose, and member list.

2. `/groups/[slug]`
Land on an overview page with balances, budget summaries, and recent activity.

3. `/groups/[slug]/expenses/new`
Capture a payment with payer, date, category, notes, and participant selection.

4. `/groups/[slug]/expenses`
Review the ledger with server-rendered filtering by category and payer.

5. `/groups/[slug]/settlements`
See the minimal settlement plan and each member's net position.

## Features

- Next.js App Router page routing
- Server actions for form submissions
- Postgres persistence for groups, members, expenses, and participants
- API routes for health checks and basic programmatic access
- Deterministic balance calculations in cents
- Even split handling with remainder-safe cent distribution
- Settlement suggestions that reduce payment count
- Responsive UI for desktop and mobile

## Tech Stack

- Next.js
- React
- Postgres
- `postgres` SQL client
- Zod for validation
- Vercel for deployment

## Backend Architecture

The backend is intentionally basic and focused:

- `lib/db.js`
Creates the Postgres connection and ensures the schema exists.

- `lib/data.js`
Handles reads and writes for groups and expenses.

- `lib/actions.js`
Implements server-side form actions for workspace creation and expense logging.

- `app/api/*`
Exposes JSON endpoints for health checks and core group operations.

## Database Setup

Set one of these environment variables in Vercel:

- `POSTGRES_URL`
- `DATABASE_URL`

The app creates its tables automatically on first successful connection, so there is no separate migration command required for the MVP.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Add your Postgres connection string to `.env.local`.

4. Start the dev server:

```bash
npm run dev
```

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add `POSTGRES_URL` or `DATABASE_URL` in the Vercel project settings.
4. Deploy.
5. Confirm the backend is reachable by opening `/api/health`.

## API Endpoints

- `GET /api/health`
- `POST /api/groups`
- `GET /api/groups/[slug]`
- `POST /api/groups/[slug]/expenses`

## AI Tools Used

- OpenAI Codex was used to redesign the application architecture, implement the App Router structure, and refine the balance and settlement logic.

## Challenges Faced

- Moving from a single static page to a routed application required redesigning the information hierarchy so each page had a single clear job.
- Adding a backend meant choosing a persistence model that would still deploy cleanly on Vercel. Postgres with server actions and route handlers kept the architecture simple.
- Splitting amounts evenly at cent precision required handling remainders deterministically so balances would stay correct over time.

## Future Improvements

- Authentication and shared workspace access
- Custom split ratios and percentage-based allocations
- Receipt uploads
- CSV or PDF exports
- Real invitations instead of manual member entry

## Notes

- The previous static local-storage implementation was replaced with routed pages and server-side persistence.
- Before final submission, add your deployed Vercel URL here and to your portfolio `projects.html` page.
