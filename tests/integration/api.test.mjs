import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw new Error("Integration tests must target a local test server.");
const post = (path, body) =>
  fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
test("group → expense → persisted ledger → balanced settlement", async () => {
  const created = await post("/api/groups", {
    name: "Integration trip",
    purpose: "A disposable local test group",
    memberNames: ["Alex", "Jamie", "Sam"],
  });
  assert.equal(created.status, 201);
  const group = await created.json();
  assert.match(group.slug, /^g-[A-Za-z0-9_-]{32}$/);
  let response = await fetch(`${base}/api/groups/${group.slug}`);
  assert.equal(response.status, 200);
  let snapshot = await response.json();
  assert.equal(snapshot.members.length, 3);
  const expense = {
    title: "Shared dinner",
    notes: "Local integration test",
    category: "Food",
    amount: 100.01,
    spentOn: "2026-09-18",
    payerMemberId: snapshot.members[0].id,
    participantIds: snapshot.members.map((m) => m.id),
  };
  assert.equal(
    (await post(`/api/groups/${group.slug}/expenses`, expense)).status,
    201,
  );
  snapshot = await (await fetch(`${base}/api/groups/${group.slug}`)).json();
  assert.equal(snapshot.summary.totalSpentCents, 10001);
  assert.equal(snapshot.expenses.length, 1);
  assert.equal(
    snapshot.balances.reduce((sum, m) => sum + m.balanceCents, 0),
    0,
  );
  assert.equal(
    snapshot.settlements.reduce((sum, s) => sum + s.amountCents, 0),
    6667,
  );
  assert.equal(
    (
      await post(`/api/groups/${group.slug}/expenses`, {
        ...expense,
        amount: 0.001,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await post(`/api/groups/${group.slug}/expenses`, {
        ...expense,
        spentOn: "2026-02-30",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await fetch(`${base}/api/groups/${group.slug}/expenses`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      })
    ).status,
    400,
  );
  const other = await (
    await post("/api/groups", {
      name: "Another group",
      purpose: "Another disposable local group",
      memberNames: ["Dana", "Eli"],
    })
  ).json();
  const otherSnapshot = await (
    await fetch(`${base}/api/groups/${other.slug}`)
  ).json();
  assert.notEqual(
    (
      await post(`/api/groups/${group.slug}/expenses`, {
        ...expense,
        payerMemberId: otherSnapshot.members[0].id,
      })
    ).status,
    201,
  );
  snapshot = await (await fetch(`${base}/api/groups/${group.slug}`)).json();
  assert.equal(snapshot.expenses.length, 1);
  assert.equal(
    (await fetch(`${base}/api/groups/guessable-legacy-name`)).status,
    404,
  );
  for (const suffix of ["", "/expenses", "/settlements", "/expenses/new"])
    assert.equal(
      (await fetch(`${base}/groups/${group.slug}${suffix}`)).status,
      200,
    );
  assert.equal((await fetch(`${base}/api/groups/demo`)).status, 200);
});
