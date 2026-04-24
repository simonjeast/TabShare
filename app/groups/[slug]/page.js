import Link from "next/link";
import { getGroupSnapshot } from "@/lib/data";
import {
  formatCurrencyFromCents,
  formatDate,
  formatSignedCurrencyFromCents
} from "@/lib/formatting";

export const dynamic = "force-dynamic";

export default async function GroupOverviewPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const snapshot = await getGroupSnapshot(slug);
  const latestExpense = snapshot.expenses[0];

  return (
    <>
      {query?.created === "group" ? (
        <div className="banner success">Workspace created. The next recommended step is to add the first expense.</div>
      ) : null}

      <section className="panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="page-title">{snapshot.group.name}</h2>
            <p className="lead">{snapshot.group.purpose}</p>
          </div>
          <div className="stack-inline">
            <Link className="primary-button" href={`/groups/${slug}/expenses/new`}>
              Add expense
            </Link>
            <Link className="secondary-button" href={`/groups/${slug}/settlements`}>
              Review settlements
            </Link>
          </div>
        </div>

        <div className="summary-grid">
          <article className="summary-card">
            <span>Total spent</span>
            <strong>{formatCurrencyFromCents(snapshot.summary.totalSpentCents)}</strong>
          </article>
          <article className="summary-card">
            <span>Average expense</span>
            <strong>{formatCurrencyFromCents(snapshot.summary.averageExpenseCents)}</strong>
          </article>
          <article className="summary-card">
            <span>Largest payment</span>
            <strong>{formatCurrencyFromCents(snapshot.summary.largestExpenseCents)}</strong>
          </article>
          <article className="summary-card">
            <span>Latest activity</span>
            <strong>{latestExpense ? formatDate(latestExpense.spentOn) : "No expenses yet"}</strong>
          </article>
        </div>
      </section>

      <div className="two-column">
        <section className="panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Balances</p>
              <h3>Net position by member</h3>
            </div>
          </div>
          <div className="balance-list">
            {snapshot.balances.map((member) => (
              <article className="balance-card" key={member.id}>
                <div>
                  <strong>{member.name}</strong>
                  <p className="helper-text">
                    Paid {formatCurrencyFromCents(member.paidCents)} · Share {formatCurrencyFromCents(member.owedCents)}
                  </p>
                </div>
                <strong className={member.balanceCents >= 0 ? "positive" : "negative"}>
                  {formatSignedCurrencyFromCents(member.balanceCents)}
                </strong>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Categories</p>
              <h3>Where the budget is going</h3>
            </div>
          </div>
          <div className="bar-list">
            {snapshot.categoryTotals.length === 0 ? (
              <div className="empty-state">Add the first expense to populate the category breakdown.</div>
            ) : (
              snapshot.categoryTotals.map((category) => (
                <div className="bar-row" key={category.category}>
                  <div className="expense-row">
                    <strong>{category.category}</strong>
                    <span className="muted">{formatCurrencyFromCents(category.amountCents)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${category.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="table-shell">
        <div className="table-toolbar">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Recent Ledger Entries</p>
              <h3>Latest recorded expenses</h3>
            </div>
            <Link className="pill-link" href={`/groups/${slug}/expenses`}>
              Open full ledger
            </Link>
          </div>
        </div>
        <div className="table-content">
          <div className="expense-list">
            {snapshot.expenses.length === 0 ? (
              <div className="empty-state">
                No expenses yet. Create the first entry to turn the workspace into a live balance sheet.
              </div>
            ) : (
              snapshot.expenses.slice(0, 5).map((expense) => (
                <article className="expense-card" key={expense.id}>
                  <div>
                    <div className="stack-inline">
                      <strong>{expense.title}</strong>
                      <span className="tag">{expense.category}</span>
                    </div>
                    <p className="helper-text">
                      Paid by {expense.payerName} on {formatDate(expense.spentOn)}
                    </p>
                    <p className="helper-text">Split with {expense.participants.map((member) => member.name).join(", ")}</p>
                  </div>
                  <strong>{formatCurrencyFromCents(expense.amountCents)}</strong>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

