import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroupSnapshot } from "@/lib/data";
import { ExpenseForm } from "@/components/ExpenseForm";
import { FlowSteps } from "@/components/FlowSteps";
import { formatCurrencyFromCents as money } from "@/lib/formatting";
export const dynamic = "force-dynamic";
export default async function NewExpensePage({ params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);
  if (!snapshot) notFound();
  return (
    <>
      <FlowSteps step={3} slug={slug} />
      <Link href={`/groups/${slug}`} className="back-link">
        ← {snapshot.group.name}
      </Link>
      <header className="workspace-heading">
        <div>
          <p className="eyebrow">Keep the moments. Split the cost.</p>
          <h1>Add an expense</h1>
          <p className="muted">Log it once. Everyone gets a clear share.</p>
        </div>
      </header>
      <div className="full-flow-grid">
        <section className="flow-form expense-page-form">
          {slug === "demo" ? (
            <div className="empty-state">
              <h2>Make it your own.</h2>
              <p>
                Create a group to add your first expense. This sample stays
                read-only.
              </p>
              <Link className="primary-button" href="/groups/new">
                Create a group →
              </Link>
            </div>
          ) : (
            <ExpenseForm groupSlug={slug} members={snapshot.members} />
          )}
        </section>
        <aside className="flow-context">
          <div className="context-card">
            <span className="context-symbol" aria-hidden="true">
              ↗
            </span>
            <p className="eyebrow">You’re splitting with</p>
            <h2>{snapshot.group.name}</h2>
            {snapshot.group.purpose ? (
              <p className="muted">{snapshot.group.purpose}</p>
            ) : null}
            <div className="context-members">
              {snapshot.members.map((m) => (
                <div key={m.id}>
                  <span className="avatar">{m.name.slice(0, 1)}</span>
                  {m.name}
                </div>
              ))}
            </div>
            <div className="context-total">
              <span>Total so far</span>
              <strong>{money(snapshot.summary.totalSpentCents)}</strong>
            </div>
          </div>
          <div className="flow-tip">
            <strong>A fair split, down to the cent.</strong>
            <p>
              Select who shared this expense. We’ll show each person’s share
              before you save.
            </p>
            <span>Next: see who owes what →</span>
          </div>
        </aside>
      </div>
    </>
  );
}
