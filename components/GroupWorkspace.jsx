"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareGroup } from "@/components/ShareGroup";
import { readSavedGroups, rememberGroup } from "@/lib/saved-groups";
import { formatCurrencyFromCents as money, formatDate } from "@/lib/formatting";
export function GroupWorkspace({
  snapshot,
  mode = "expenses",
  created,
  initialMemberId,
  children,
}) {
  const { group, members, expenses, balances, summary } = snapshot;
  const demo = group.slug === "demo";
  const [memberId, setMemberId] = useState(
    initialMemberId || (demo ? members[0]?.id : ""),
  );
  const [storageFailed, setStorageFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  useEffect(() => {
    if (demo) return;
    const saved = readSavedGroups().find((item) => item.slug === group.slug);
    const selected = members.some((member) => member.id === initialMemberId)
      ? initialMemberId
      : saved?.memberId || "";
    setMemberId(selected);
    setStorageFailed(!rememberGroup(group, selected));
  }, [group.slug, initialMemberId, demo]);
  const person = balances.find((member) => member.id === memberId);
  const filtered = expenses.filter(
    (expense) =>
      (category === "All" || expense.category === category) &&
      `${expense.title} ${expense.payerName} ${expense.notes}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const categories = [...new Set(expenses.map((expense) => expense.category))];
  return (
    <>
      <Link href="/" className="back-link">
        ← Your groups
      </Link>
      <header className="workspace-heading">
        <div>
          <p className="eyebrow">{members.length} people · Shared in USD</p>
          <h1>{group.name}</h1>
          {group.purpose ? <p className="muted">{group.purpose}</p> : null}
          <div className="member-strip">
            {members.map((member) => (
              <span className="avatar" key={member.id} title={member.name}>
                {member.name.slice(0, 1)}
              </span>
            ))}
            <label className="view-as">
              Viewing as{" "}
              <select
                aria-label="View balances as"
                value={memberId}
                onChange={(event) => {
                  setMemberId(event.target.value);
                  if (!demo)
                    setStorageFailed(!rememberGroup(group, event.target.value));
                }}
              >
                <option value="">Choose your name</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {!demo ? (
          <ShareGroup slug={group.slug} />
        ) : (
          <span className="tag">Sample group</span>
        )}
      </header>
      {created ? (
        <div className="banner success" role="status">
          {created === "group"
            ? "Your group is ready. Add your first expense, then share the invitation link."
            : created === "payment"
              ? "Payment recorded. Everyone’s balance is up to date."
              : "Expense added. Your balances are up to date."}
        </div>
      ) : null}
      {storageFailed ? (
        <div className="banner warning">
          This browser couldn’t remember your group. Save the invitation link so
          you can return.
        </div>
      ) : null}
      <div className="group-summary">
        <div>
          <span>Total shared expenses</span>
          <strong>{money(summary.totalSpentCents)}</strong>
          <small>{summary.expenseCount} expenses</small>
        </div>
        <div
          className={`personal-summary ${person?.balanceCents < 0 ? "owed" : ""}`}
        >
          <span>
            {person
              ? person.balanceCents > 0
                ? "You get back"
                : person.balanceCents < 0
                  ? "You owe"
                  : "You’re all settled up"
              : "Your balance"}
          </span>
          <strong>
            {person ? money(Math.abs(person.balanceCents)) : "Choose your name"}
          </strong>
          <small>
            {person
              ? `Viewing as ${person.name}`
              : "A display preference, not a sign-in"}
          </small>
        </div>
      </div>
      <div className="group-toolbar">
        <nav className="workspace-tabs" aria-label="Group views">
          <Link
            href={`/groups/${group.slug}`}
            className={mode === "expenses" ? "active" : ""}
            aria-current={mode === "expenses" ? "page" : undefined}
          >
            Expenses <span>{summary.expenseCount}</span>
          </Link>
          <Link
            href={`/groups/${group.slug}/settlements`}
            className={mode === "balances" ? "active" : ""}
            aria-current={mode === "balances" ? "page" : undefined}
          >
            Balances & settle up
          </Link>
        </nav>
        <Link
          className="primary-button"
          href={demo ? "/groups/new" : `/groups/${group.slug}/expenses/new`}
        >
          {demo ? "Create your own group" : "+ Add expense"}
        </Link>
      </div>
      {mode === "expenses" ? (
        <section className="expense-workspace">
          <div className="ledger-filters">
            <input
              aria-label="Search expenses"
              className="input"
              placeholder="Search expenses…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="select"
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          {!filtered.length ? (
            <div className="empty-state">
              <h2>
                {expenses.length
                  ? "No matching expenses"
                  : "Your group’s first expense starts here."}
              </h2>
              <p>
                {expenses.length
                  ? "Try another search or category."
                  : "Paid for something together? Add it once and we’ll work out everyone’s share."}
              </p>
              {!expenses.length ? (
                <Link
                  className="primary-button"
                  href={`/groups/${group.slug}/expenses/new`}
                >
                  + Add an expense
                </Link>
              ) : (
                <button
                  className="secondary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="expense-list">
              {filtered.map((expense) => (
                <details className="ledger-item" key={expense.id}>
                  <summary>
                    <span className="expense-icon" aria-hidden="true">
                      {expense.category.slice(0, 1)}
                    </span>
                    <span className="expense-description">
                      <strong>{expense.title}</strong>
                      <small>
                        {expense.payerName} paid · {formatDate(expense.spentOn)}
                      </small>
                    </span>
                    <span className="expense-value">
                      <strong>{money(expense.amountCents)}</strong>
                      <small>{expense.category} · Details ↓</small>
                    </span>
                  </summary>
                  <div className="expense-detail">
                    <p>
                      Split equally between{" "}
                      {expense.participants
                        .map((member) => member.name)
                        .join(", ")}
                      .
                    </p>
                    {expense.notes ? <p>{expense.notes}</p> : null}
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      ) : (
        children
      )}
    </>
  );
}
