import { calculateDerivedState } from "@/lib/calculations";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";

export async function getGroupSnapshot(slug) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await ensureSchema();
  const sql = getSql();

  const groups = await sql`
    select
      id,
      slug,
      name,
      purpose,
      currency,
      created_at as "createdAt"
    from groups
    where slug = ${slug}
    limit 1
  `;

  const group = groups[0];

  if (!group) {
    return null;
  }

  const members = await sql`
    select
      id,
      name,
      created_at as "createdAt"
    from members
    where group_id = ${group.id}
    order by created_at asc, name asc
  `;

  const expenses = await sql`
    select
      e.id,
      e.title,
      e.notes,
      e.category,
      e.amount_cents as "amountCents",
      e.spent_on as "spentOn",
      e.created_at as "createdAt",
      e.payer_member_id as "payerId",
      payer.name as "payerName"
    from expenses e
    join members payer on payer.id = e.payer_member_id
    where e.group_id = ${group.id}
    order by e.spent_on desc, e.created_at desc
  `;

  const participantRows = await sql`
    select
      ep.expense_id as "expenseId",
      ep.member_id as "memberId",
      ep.position as "position",
      m.name as "memberName"
    from expense_participants ep
    join expenses e on e.id = ep.expense_id
    join members m on m.id = ep.member_id
    where e.group_id = ${group.id}
    order by ep.expense_id asc, ep.position asc
  `;

  const participantMap = new Map();

  participantRows.forEach((row) => {
    const current = participantMap.get(row.expenseId) ?? [];
    current.push({
      id: row.memberId,
      name: row.memberName,
      position: row.position
    });
    participantMap.set(row.expenseId, current);
  });

  const hydratedExpenses = expenses.map((expense) => ({
    ...expense,
    participants: participantMap.get(expense.id) ?? []
  }));

  const derived = calculateDerivedState(members, hydratedExpenses);

  return {
    group,
    members,
    expenses: hydratedExpenses,
    ...derived
  };
}

export async function createGroup(input) {
  await ensureSchema();
  const sql = getSql();

  return sql.begin(async (transaction) => {
    const slug = await generateUniqueSlug(transaction, input.name);
    const groupId = crypto.randomUUID();
    const groups = await transaction`
      insert into groups (id, slug, name, purpose)
      values (${groupId}, ${slug}, ${input.name}, ${input.purpose})
      returning id, slug, name, purpose, currency, created_at as "createdAt"
    `;
    const group = groups[0];

    for (const memberName of input.memberNames) {
      const memberId = crypto.randomUUID();
      await transaction`
        insert into members (id, group_id, name)
        values (${memberId}, ${group.id}, ${memberName})
      `;
    }

    return group;
  });
}

export async function createExpense(input) {
  await ensureSchema();
  const sql = getSql();

  return sql.begin(async (transaction) => {
    const groups = await transaction`
      select id
      from groups
      where slug = ${input.groupSlug}
      limit 1
    `;
    const group = groups[0];

    if (!group) {
      throw new Error("Group not found.");
    }

    const members = await transaction`
      select id, name
      from members
      where group_id = ${group.id}
    `;
    const memberIds = new Set(members.map((member) => member.id));

    if (!memberIds.has(input.payerMemberId)) {
      throw new Error("Payer is not part of this group.");
    }

    const uniqueParticipants = Array.from(new Set(input.participantIds));
    if (uniqueParticipants.some((memberId) => !memberIds.has(memberId))) {
      throw new Error("A selected participant is not part of this group.");
    }

    const expenseId = crypto.randomUUID();
    const expenses = await transaction`
      insert into expenses (id, group_id, payer_member_id, title, notes, category, amount_cents, spent_on)
      values (
        ${expenseId},
        ${group.id},
        ${input.payerMemberId},
        ${input.title},
        ${input.notes},
        ${input.category},
        ${toCents(input.amount)},
        ${input.spentOn}
      )
      returning id
    `;
    const expense = expenses[0];

    for (const [index, memberId] of uniqueParticipants.entries()) {
      await transaction`
        insert into expense_participants (expense_id, member_id, position)
        values (${expense.id}, ${memberId}, ${index})
      `;
    }

    return expense;
  });
}

export async function getDatabaseHealth() {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      databaseConfigured: false,
      message: "POSTGRES_URL or DATABASE_URL is missing."
    };
  }

  try {
    await ensureSchema();
    const sql = getSql();
    await sql`select 1`;

    return {
      ok: true,
      databaseConfigured: true,
      message: "Database reachable and schema ensured."
    };
  } catch (error) {
    return {
      ok: false,
      databaseConfigured: true,
      message: error instanceof Error ? error.message : "Unknown database error."
    };
  }
}

async function generateUniqueSlug(transaction, name) {
  const base = slugify(name);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${Math.random().toString(36).slice(2, 6)}`;
    const candidate = `${base}${suffix}`;
    const matches = await transaction`
      select slug
      from groups
      where slug = ${candidate}
      limit 1
    `;

    if (matches.length === 0) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique slug.");
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "group";
}

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}
