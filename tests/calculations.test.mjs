import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateDerivedState,
  calculateSettlements,
  splitAmountAcrossParticipants,
} from "../lib/calculations.js";
import { groupInputSchema, expenseInputSchema } from "../lib/validation.js";
import { createGroupSlug, isPrivateGroupSlug } from "../lib/access.js";

const members = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
].map((id, i) => ({ id, name: `Member ${i}` }));
test("every cent is conserved across uneven splits", () => {
  for (let amount = 1; amount < 1000; amount++) {
    const shares = splitAmountAcrossParticipants(amount, members);
    assert.equal(
      shares.reduce((sum, x) => sum + x.shareCents, 0),
      amount,
    );
    assert.ok(
      Math.max(...shares.map((x) => x.shareCents)) -
        Math.min(...shares.map((x) => x.shareCents)) <=
        1,
    );
  }
});
test("settlement clears every balance without changing source data", () => {
  const state = calculateDerivedState(members, [
    {
      amountCents: 10001,
      payerId: members[0].id,
      participants: members,
      category: "Food",
    },
    {
      amountCents: 5999,
      payerId: members[1].id,
      participants: members.slice(1),
      category: "Lodging",
    },
  ]);
  const before = structuredClone(state.balances);
  const balances = new Map(state.balances.map((m) => [m.id, m.balanceCents]));
  assert.equal(
    [...balances.values()].reduce((a, b) => a + b, 0),
    0,
  );
  for (const payment of calculateSettlements(state.balances)) {
    assert.ok(payment.amountCents > 0 && Number.isInteger(payment.amountCents));
    balances.set(
      payment.fromId,
      balances.get(payment.fromId) + payment.amountCents,
    );
    balances.set(
      payment.toId,
      balances.get(payment.toId) - payment.amountCents,
    );
  }
  assert.ok([...balances.values()].every((x) => x === 0));
  assert.deepEqual(state.balances, before);
});
const valid = {
  groupSlug: createGroupSlug(),
  title: "Dinner",
  notes: "",
  category: "Food",
  amount: 10.01,
  spentOn: "2026-09-18",
  payerMemberId: members[0].id,
  participantIds: members.map((m) => m.id),
};
test("rejects zero, sub-cent, negative, infinite, and oversized expenses", () => {
  for (const amount of [0, 0.001, -1, Infinity, NaN, 50000.01, 1.999])
    assert.equal(
      expenseInputSchema.safeParse({ ...valid, amount }).success,
      false,
    );
  for (const amount of [0.01, 10.01, 50000])
    assert.equal(
      expenseInputSchema.safeParse({ ...valid, amount }).success,
      true,
    );
});
test("rejects impossible and ambiguous calendar dates", () => {
  for (const spentOn of [
    "2026-02-30",
    "2025-02-29",
    "09/18/2026",
    "garbage",
    "2026-13-01",
  ])
    assert.equal(
      expenseInputSchema.safeParse({ ...valid, spentOn }).success,
      false,
    );
  assert.equal(
    expenseInputSchema.safeParse({ ...valid, spentOn: "2024-02-29" }).success,
    true,
  );
});
test("rejects duplicate participants and duplicate group names", () => {
  assert.equal(
    expenseInputSchema.safeParse({
      ...valid,
      participantIds: [members[0].id, members[0].id],
    }).success,
    false,
  );
  assert.equal(
    groupInputSchema.safeParse({
      name: "Trip",
      purpose: "Our summer holiday",
      memberNames: ["Alex", "alex"],
    }).success,
    false,
  );
});
test("private links have cryptographic entropy and legacy links are rejected", () => {
  const slugs = new Set(Array.from({ length: 1000 }, createGroupSlug));
  assert.equal(slugs.size, 1000);
  assert.ok([...slugs].every(isPrivateGroupSlug));
  for (const slug of ["lisbon-trip", "demo", "g-short", "", null])
    assert.equal(isPrivateGroupSlug(slug), false);
});
