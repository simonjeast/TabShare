import { getGroupSnapshot } from "@/lib/data";
import { formatCurrencyFromCents, formatSignedCurrencyFromCents } from "@/lib/formatting";

export const dynamic = "force-dynamic";

export default async function SettlementsPage({ params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);

  return (
    <div className="two-column">
      <section className="panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Settlement Plan</p>
            <h2>Suggested payments</h2>
          </div>
        </div>
        <div className="settlement-list">
          {snapshot.settlements.length === 0 ? (
            <div className="empty-state">Everyone is settled or there are no expenses yet.</div>
          ) : (
            snapshot.settlements.map((settlement, index) => (
              <article className="settlement-card" key={`${settlement.fromId}-${settlement.toId}-${index}`}>
                <div>
                  <strong>
                    {settlement.fromName} pays {settlement.toName}
                  </strong>
                  <p className="helper-text">This reduces the number of transactions required to clear the group.</p>
                </div>
                <strong>{formatCurrencyFromCents(settlement.amountCents)}</strong>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Position by Member</p>
            <h2>Who is net positive or negative</h2>
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
    </div>
  );
}

