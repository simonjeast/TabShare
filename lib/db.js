import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";

let client;
let schemaPromise;

export function isDatabaseConfigured() {
  return Boolean(connectionString);
}

export function getSql() {
  if (!isDatabaseConfigured()) {
    throw new Error("Database connection is not configured.");
  }

  if (!client) {
    client = postgres(connectionString, {
      max: 1,
      ssl: process.env.NODE_ENV === "production" ? "require" : undefined
    });
  }

  return client;
}

export async function ensureSchema() {
  if (!isDatabaseConfigured()) {
    throw new Error("Database connection is not configured.");
  }

  if (!schemaPromise) {
    const sql = getSql();

    schemaPromise = (async () => {
      await sql`
        create table if not exists groups (
          id text primary key,
          slug text unique not null,
          name text not null,
          purpose text not null,
          currency text not null default 'USD',
          created_at timestamptz not null default now()
        )
      `;
      await sql`
        create table if not exists members (
          id text primary key,
          group_id text not null references groups(id) on delete cascade,
          name text not null,
          created_at timestamptz not null default now()
        )
      `;
      await sql`
        create table if not exists expenses (
          id text primary key,
          group_id text not null references groups(id) on delete cascade,
          payer_member_id text not null references members(id) on delete restrict,
          title text not null,
          notes text not null default '',
          category text not null,
          amount_cents integer not null,
          spent_on date not null,
          created_at timestamptz not null default now()
        )
      `;
      await sql`
        create table if not exists expense_participants (
          expense_id text not null references expenses(id) on delete cascade,
          member_id text not null references members(id) on delete cascade,
          position integer not null,
          primary key (expense_id, member_id)
        )
      `;
      await sql`create index if not exists idx_groups_slug on groups(slug)`;
      await sql`create index if not exists idx_members_group_id on members(group_id)`;
      await sql`create index if not exists idx_expenses_group_id on expenses(group_id)`;
      await sql`create index if not exists idx_expense_participants_expense_id on expense_participants(expense_id)`;
    })();
  }

  await schemaPromise;
}
