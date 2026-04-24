import Link from "next/link";
import { getGroupSnapshot } from "@/lib/data";
import { categories } from "@/lib/validation";
import { formatCurrencyFromCents, formatDate } from "@/lib/formatting";

export const dynamic = "force-dynamic";

export default async function ExpensesPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const snapshot = await getGroupSnapshot(slug);
  const categoryFilter = query?.category ?? "All";
  const payerFilter = query?.payer ?? "All";

  const expenses = snapshot.expenses.filter((expense) => {
    const matchesCategory = categoryFilter === "All" || expense.category === categoryFilter;
    const matchesPayer = payerFilter === "All" || expense.payerId === payerFilter;

    return matchesCategory && matchesPayer;
  });

  return (
    <>
      {query?.created === "expense" ? (
        <div className="banner success">Expense saved. The ledger and balances are already updated.</div>
      ) : null}

      <section className="table-shell">
        <div className="table-toolbar">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Ledger</p>
              <h2>Expense history</h2>
            </div>
            <Link className="primary-button" href={`/groups/${slug}/expenses/new`}>
              Add another expense
            </Link>
          </div>
          <form className="filter-form" method="get">
            <div className="field-stack">
              <label htmlFor="category">Category</label>
              <select className="select" id="category" name="category" defaultValue={categoryFilter}>
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-stack">
              <label htmlFor="payer">Payer</label>
              <select className="select" id="payer" name="payer" defaultValue={payerFilter}>
                <option value="All">All payers</option>
                {snapshot.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="secondary-button" type="submit">
              Apply filters
            </button>
          </form>
        </div>
        <div className="table-content">
          <div className="expense-list">
            {expenses.length === 0 ? (
              <div className="empty-state">No ledger entries match the active filters.</div>
            ) : (
              expenses.map((expense) => (
                <article className="expense-card" key={expense.id}>
                  <div>
                    <div className="stack-inline">
                      <strong>{expense.title}</strong>
                      <span className="tag">{expense.category}</span>
                    </div>
                    <p className="helper-text">
                      {formatDate(expense.spentOn)} · Paid by {expense.payerName}
                    </p>
                    {expense.notes ? <p className="helper-text">{expense.notes}</p> : null}
                    <p className="helper-text">Participants: {expense.participants.map((member) => member.name).join(", ")}</p>
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

