# TabShare

TabShare is a full-stack shared expense app for trips, roommates, and collaborative budgets. Users can create a group workspace, add members, record expenses, review a filtered ledger, and see a settlement plan that shows who should pay whom.

The final product is a routed Next.js app backed by Postgres. It uses server-side persistence, server actions, API routes, validation, and deterministic balance calculations.

## Live Demo URL

https://tabshare.me

## Features

- Create expense workspaces for trips, households, or shared projects
- Add 2 to 12 group members during workspace setup
- Record expenses with title, amount, category, date, payer, notes, and selected participants
- Split expenses evenly across selected participants
- Store groups, members, expenses, and participant splits in Postgres
- View a group dashboard with total spend, average expense, largest payment, latest activity, balances, recent ledger entries, and category totals
- Filter the full ledger by category and payer
- Generate settlement suggestions that minimize the number of payments needed to clear balances
- Use cent-based calculations and deterministic remainder handling to avoid rounding drift
- Access JSON endpoints for health checks, group creation, group snapshots, and expense creation
- Responsive interface for desktop and mobile screens

## App Flow

1. `/`
   Landing page with the product overview and entry point.

2. `/groups/new`
   Create a workspace with a name, purpose, and member list.

3. `/groups/[slug]`
   Review the dashboard for balances, spending summaries, category totals, and recent expenses.

4. `/groups/[slug]/expenses/new`
   Add a shared expense and choose the payer and participants.

5. `/groups/[slug]/expenses`
   Review and filter the full ledger.

6. `/groups/[slug]/settlements`
   View suggested payments and each member's net position.

## Technologies Used

- Next.js 16 with the App Router
- React 19
- Server Actions for form submissions
- Route Handlers for API endpoints
- Postgres for persistence
- `postgres` for SQL access
- Zod for input validation
- Global CSS stylesheet
- Vercel for deployment

## Backend and API

The backend is intentionally small:

- `lib/db.js` creates the Postgres client and ensures tables exist.
- `lib/data.js` handles group and expense reads/writes.
- `lib/actions.js` handles server-side form submissions and redirects.
- `lib/calculations.js` handles balances, category totals, even splits, and settlements.
- `lib/validation.js` centralizes form and API validation.

Available endpoints:

- `GET /api/health`
- `POST /api/groups`
- `GET /api/groups/[slug]`
- `POST /api/groups/[slug]/expenses`

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Add a Postgres connection string to `.env.local`:

```bash
POSTGRES_URL="postgres://user:password@host:5432/database"
```

`DATABASE_URL` also works if `POSTGRES_URL` is not set.

4. Start the development server:

```bash
npm run dev
```

5. Open the app locally:

```bash
http://localhost:3000
```

## Deployment

The app is deployed on Vercel at https://tabshare.me.

Required environment variable:

- `POSTGRES_URL` or `DATABASE_URL`

After deployment, `/api/health` can be used to confirm that the app can reach the database and ensure its schema.

## AI Tools Used

- OpenAI Codex was used to help redesign the app from the original local-storage proposal into a routed full-stack product.
- Codex assisted with the App Router structure, server actions, route handlers, database layer, validation flow, and balance/settlement logic.

## Challenges

- Converting the initial static app idea into a full-stack Next.js app required redesigning the user journey into separate focused routes.
- Adding persistence meant choosing a database flow that would work locally and on Vercel without a heavy migration setup.
- Balance math needed to avoid floating-point issues, so amounts are converted to cents before calculations.
- Even splits can leave leftover cents, so the app distributes remainders deterministically based on participant order.
- Settlement suggestions needed to reduce payment count while keeping each member's final balance correct.

## Future Improvements

- Add authentication and private group access
- Add shareable invitations instead of manual member entry
- Support unequal splits by amount, share, or percentage
- Add receipt uploads
- Add CSV or PDF exports
- Add expense editing and deletion
- Add charts for spending trends by person and category
- Add multi-currency support
- Add direct payment options through Stripe auth
