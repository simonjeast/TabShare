import { notFound } from "next/navigation";
import Link from "next/link";
import { ExpenseForm } from "@/components/ExpenseForm";
import { getGroupSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewExpensePage({ params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);
  if (!snapshot) notFound();
  if (slug === "demo")
    return (
      <section className="panel">
        <p className="eyebrow">Sample group</p>
        <h2>Ready to split your own expenses?</h2>
        <p className="lead">
          The sample is read-only. Create a group to add your people and your
          expenses.
        </p>
        <Link className="primary-button" href="/groups/new">
          Create a group →
        </Link>
      </section>
    );

  return (
    <section className="panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Add Expense</p>
          <h2>What did you pay for?</h2>
        </div>
      </div>
      <ExpenseForm groupSlug={slug} members={snapshot.members} />
    </section>
  );
}
