import { notFound } from "next/navigation";
import { getGroupSnapshot } from "@/lib/data";
import { GroupWorkspace } from "@/components/GroupWorkspace";
import { PaymentForm } from "@/components/PaymentForm";
import { formatCurrencyFromCents as money, formatDate } from "@/lib/formatting";
export const dynamic = "force-dynamic";
export default async function SettlementsPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const snapshot = await getGroupSnapshot(slug);
  if (!snapshot) notFound();
  return (
    <GroupWorkspace snapshot={snapshot} mode="balances" created={query.created}>
      <div className="balance-columns">
        <section>
          <h2>Settle up</h2>
          <p className="muted">
            Pay each other your usual way, then record it here.
          </p>
          {!snapshot.settlements.length ? (
            <div className="settled-state">
              <span>✓</span>
              <h3>
                {snapshot.expenses.length
                  ? "Everyone’s square."
                  : "No payments needed."}
              </h3>
              <p>
                {snapshot.expenses.length
                  ? "All shared expenses are settled."
                  : "Add an expense to see who owes what."}
              </p>
            </div>
          ) : (
            snapshot.settlements.map((payment) =>
              slug === "demo" ? (
                <div
                  className="payment-card sample-payment"
                  key={payment.fromId + payment.toId}
                >
                  <span>
                    {payment.fromName} pays {payment.toName}
                  </span>
                  <strong>{money(payment.amountCents)}</strong>
                </div>
              ) : (
                <PaymentForm
                  key={payment.fromId + payment.toId + payment.amountCents}
                  slug={slug}
                  payment={payment}
                />
              ),
            )
          )}
          {(snapshot.payments || []).length ? (
            <div className="payment-history">
              <h3>Recorded payments</h3>
              {snapshot.payments.map((payment) => (
                <div key={payment.id} className="balance-card">
                  <div>
                    <strong>
                      {payment.fromName} paid {payment.toName}
                    </strong>
                    <p className="helper-text">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                  <strong>{money(payment.amountCents)}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </section>
        <aside className="member-balances">
          <h2>Everyone’s balance</h2>
          {snapshot.balances.map((member) => (
            <div className="balance-card" key={member.id}>
              <div>
                <strong>{member.name}</strong>
                <p className="helper-text">
                  Paid {money(member.paidCents)} · Share{" "}
                  {money(member.owedCents)}
                </p>
              </div>
              <div
                className={member.balanceCents < 0 ? "negative" : "positive"}
              >
                <strong>{money(Math.abs(member.balanceCents))}</strong>
                <small>
                  {member.balanceCents < 0
                    ? "owes"
                    : member.balanceCents > 0
                      ? "gets back"
                      : "settled"}
                </small>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </GroupWorkspace>
  );
}
