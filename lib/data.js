import { InputError } from "@/lib/errors";
import { consumeWriteLimit } from "@/lib/rate-limit";
import { createGroupSlug, isPrivateGroupSlug } from "@/lib/access";
import { getDemoSnapshot } from "@/lib/demo";
import { calculateDerivedState } from "@/lib/calculations";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";

export async function getGroupSnapshot(slug) {
  if (slug === "demo") return getDemoSnapshot();
  if (!isPrivateGroupSlug(slug) || !isDatabaseConfigured()) {
    return null;
  }

  await ensureSchema();
  const sql = getSql();

  return readGroupSnapshot(sql, slug);
}

async function readGroupSnapshot(sql, slug) {
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
      position: row.position,
    });
    participantMap.set(row.expenseId, current);
  });

  const hydratedExpenses = expenses.map((expense) => ({
    ...expense,
    participants: participantMap.get(expense.id) ?? [],
  }));

  const payments = await sql`
    select p.id, p.from_member_id as "fromId", p.to_member_id as "toId",
      p.amount_cents as "amountCents", p.created_at as "createdAt",
      sender.name as "fromName", recipient.name as "toName"
    from payments p
    join members sender on sender.id = p.from_member_id
    join members recipient on recipient.id = p.to_member_id
    where p.group_id = ${group.id} order by p.created_at desc
  `;
  const derived = calculateDerivedState(members, hydratedExpenses, payments);

  return {
    group,
    members,
    expenses: hydratedExpenses,
    payments,
    ...derived,
  };
}

export async function createGroup(input) {
  await ensureSchema();
  const sql = getSql();
  await consumeWriteLimit(sql, "group-creation", 100, 3600);

  return sql.begin(async (transaction) => {
    const slug = createGroupSlug();
    const groupId = crypto.randomUUID();
    const groups = await transaction`
      insert into groups (id, slug, name, purpose)
      values (${groupId}, ${slug}, ${input.name}, ${input.purpose})
      returning id, slug, name, purpose, currency, created_at as "createdAt"
    `;
    const group = groups[0];

    let firstMemberId;
    for (const memberName of input.memberNames) {
      const memberId = crypto.randomUUID();
      firstMemberId ??= memberId;
      await transaction`
        insert into members (id, group_id, name)
        values (${memberId}, ${group.id}, ${memberName})
      `;
    }

    return { ...group, firstMemberId };
  });
}

export async function createExpense(input) {
  if (!isPrivateGroupSlug(input.groupSlug))
    throw new InputError("This group link is not valid.", 404);
  await ensureSchema();
  const sql = getSql();

  return sql.begin(async (transaction) => {
    const groups = await transaction`
      select id
      from groups
      where slug = ${input.groupSlug}
      limit 1 for update
    `;
    const group = groups[0];

    if (!group) {
      throw new InputError("Group not found.", 404);
    }

    await consumeWriteLimit(transaction, `expenses:${group.id}`, 120, 60);
    const members = await transaction`
      select id, name
      from members
      where group_id = ${group.id}
    `;
    const memberIds = new Set(members.map((member) => member.id));

    if (!memberIds.has(input.payerMemberId)) {
      throw new InputError("Payer is not part of this group.");
    }

    const uniqueParticipants = Array.from(new Set(input.participantIds));
    if (uniqueParticipants.some((memberId) => !memberIds.has(memberId))) {
      throw new InputError("A selected participant is not part of this group.");
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
      message: "POSTGRES_URL or DATABASE_URL is missing.",
    };
  }

  try {
    await ensureSchema();
    const sql = getSql();
    await sql`select 1`;

    return {
      ok: true,
      databaseConfigured: true,
      message: "Database reachable and schema ensured.",
    };
  } catch (error) {
    return {
      ok: false,
      databaseConfigured: true,
      message: "Database is temporarily unavailable.",
    };
  }
}

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

export async function recordPayment(input) {
  if (!isPrivateGroupSlug(input.groupSlug))
    throw new InputError("Invalid group link.", 404);
  await ensureSchema();
  const sql = getSql();
  return sql.begin(async (tx) => {
    const groups =
      await tx`select id from groups where slug=${input.groupSlug} for update`;
    if (!groups[0]) throw new InputError("Group not found.", 404);
    const existing =
      await tx`select id, group_id, from_member_id, to_member_id, amount_cents from payments where id=${input.requestId}`;
    if (existing[0]) {
      const p = existing[0];
      if (
        p.group_id !== groups[0].id ||
        p.from_member_id !== input.fromId ||
        p.to_member_id !== input.toId ||
        p.amount_cents !== toCents(input.amount)
      )
        throw new InputError(
          "This payment request has already been used.",
          409,
        );
      return { id: p.id };
    }
    await consumeWriteLimit(tx, `payments:${groups[0].id}`, 60, 60);
    const snapshot = await readGroupSnapshot(tx, input.groupSlug);
    const suggestion = snapshot.settlements.find(
      (payment) =>
        payment.fromId === input.fromId && payment.toId === input.toId,
    );
    const amountCents = toCents(input.amount);
    if (!suggestion || amountCents > suggestion.amountCents)
      throw new InputError(
        "Balances have changed. Refresh the group before recording this payment.",
        409,
      );
    await tx`insert into payments (id,group_id,from_member_id,to_member_id,amount_cents) values (${input.requestId},${groups[0].id},${input.fromId},${input.toId},${amountCents})`;
    return { id: input.requestId };
  });
}
