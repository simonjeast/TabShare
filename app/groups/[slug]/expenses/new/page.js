import { ExpenseForm } from "@/components/ExpenseForm";
import { getGroupSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewExpensePage({ params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);

  return (
    <section className="panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Add Expense</p>
          <h2>Capture a payment with enough context to settle it later.</h2>
        </div>
      </div>
      <ExpenseForm groupSlug={slug} members={snapshot.members} />
    </section>
  );
}

