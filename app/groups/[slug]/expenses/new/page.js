import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroupSnapshot } from "@/lib/data";
import { ExpenseForm } from "@/components/ExpenseForm";
export const dynamic = "force-dynamic";
export default async function NewExpensePage({ params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);
  if (!snapshot) notFound();
  return (
    <div className="focused-flow">
      <Link href={`/groups/${slug}`} className="back-link">
        ← {snapshot.group.name}
      </Link>
      <header className="flow-heading">
        <p className="eyebrow">{snapshot.group.name}</p>
        <h1>Add an expense</h1>
        <p className="muted">You paid. We’ll do the splitting.</p>
      </header>
      <section className="flow-form">
        {slug === "demo" ? (
          <div className="empty-state">
            <h2>Ready for your own group?</h2>
            <p>
              The sample is read-only. Create a group to start splitting your
              expenses.
            </p>
            <Link className="primary-button" href="/groups/new">
              Create a group →
            </Link>
          </div>
        ) : (
          <ExpenseForm groupSlug={slug} members={snapshot.members} />
        )}
      </section>
    </div>
  );
}
