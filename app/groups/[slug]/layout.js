import Link from "next/link";
import { notFound } from "next/navigation";
import { GroupNav } from "@/components/GroupNav";
import { formatCurrencyFromCents } from "@/lib/formatting";
import { getGroupSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GroupLayout({ children, params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);

  if (!snapshot) {
    notFound();
  }

  return (
    <main className="site-shell">
      <header className="page-header compact">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">TS</span>
            <span className="brand-copy">
              TabShare
              <small>{snapshot.group.name}</small>
            </span>
          </Link>
          <GroupNav slug={slug} />
        </div>

        <div className="page-header-meta">
          <div className="metric-card">
            <span className="metric-label">Members</span>
            <strong>{snapshot.members.length}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Expenses</span>
            <strong>{snapshot.summary.expenseCount}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Total logged</span>
            <strong>{formatCurrencyFromCents(snapshot.summary.totalSpentCents)}</strong>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
