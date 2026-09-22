import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroupSnapshot } from "@/lib/data";
import { PaymentForm } from "@/components/PaymentForm";
import { FlowSteps } from "@/components/FlowSteps";
import { formatCurrencyFromCents as money, formatDate } from "@/lib/formatting";
export const dynamic = "force-dynamic";
export default async function SettlementsPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const snapshot = await getGroupSnapshot(slug);
  if (!snapshot) notFound();
  const index = Math.max(
    0,
    Math.min(
      snapshot.settlements.length - 1,
      Number.parseInt(query.payment, 10) || 0,
    ),
  );
  const payment = snapshot.settlements[index];
  return (
    <>
      <FlowSteps step={4} slug={slug} />
      <Link href={`/groups/${slug}`} className="back-link">
        ← {snapshot.group.name}
      </Link>
      <header className="workspace-heading">
        <div>
          <p className="eyebrow">Close the loop, together</p>
          <h1>Settle up</h1>
          <p className="muted">
            A little less keeping score. A little more being together.
          </p>
        </div>
        {slug !== "demo" ? (
          <Link
            href={`/groups/${slug}/expenses/new`}
            className="secondary-button"
          >
            + Add another expense
          </Link>
        ) : null}
      </header>
      {query.created ? (
        <div className="payment-success" role="status">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>
              {query.created === "payment"
                ? "Payment recorded"
                : "Expense saved"}
            </strong>
            <p>
              {query.created === "payment"
                ? "One step closer to being even."
                : "Here’s how to settle the balance."}
            </p>
          </div>
        </div>
      ) : null}
      <div className="full-flow-grid settlement-grid">
        <div>
          {!payment ? (
            <section className="settlement-focus all-settled">
              <div className="payment-symbol">✓</div>
              <h2>Everyone’s square.</h2>
              <p>
                {snapshot.expenses.length
                  ? "All shared expenses are settled."
                  : "No payments needed. Add an expense to get started."}
              </p>
              <Link href={`/groups/${slug}`} className="primary-button">
                Back to your group →
              </Link>
            </section>
          ) : slug === "demo" ? (
            <section className="settlement-focus">
              <div className="payment-symbol">↔</div>
              <p className="payment-direction">
                {payment.fromName} pays {payment.toName}
              </p>
              <h2 className="payment-amount">{money(payment.amountCents)}</h2>
              <p>This is a sample settlement. No payment will be recorded.</p>
            </section>
          ) : (
            <PaymentForm
              key={payment.fromId + payment.toId + payment.amountCents}
              slug={slug}
              payment={payment}
            />
          )}
          {snapshot.payments?.length ? (
            <section className="payment-history">
              <h2>Recorded payments</h2>
              {snapshot.payments.map((p) => (
                <div className="balance-card" key={p.id}>
                  <div>
                    <strong>
                      {p.fromName} paid {p.toName}
                    </strong>
                    <p className="helper-text">{formatDate(p.createdAt)}</p>
                  </div>
                  <strong className="positive">{money(p.amountCents)}</strong>
                </div>
              ))}
            </section>
          ) : null}
        </div>
        <aside className="flow-context">
          {snapshot.settlements.length > 1 ? (
            <section className="context-card next-payments">
              <h2>Who pays whom</h2>
              {snapshot.settlements.map((p, i) => (
                <Link
                  key={p.fromId + p.toId}
                  href={`/groups/${slug}/settlements?payment=${i}`}
                  className={`payment-choice ${i === index ? "selected" : ""}`}
                >
                  <span>
                    {p.fromName} → {p.toName}
                  </span>
                  <strong>{money(p.amountCents)}</strong>
                </Link>
              ))}
            </section>
          ) : null}
          <section className="context-card">
            <h2>Everyone’s balance</h2>
            {snapshot.balances.map((member) => (
              <div className="balance-card" key={member.id}>
                <div className="balance-person">
                  <span className="avatar">{member.name.slice(0, 1)}</span>
                  <strong>{member.name}</strong>
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
          </section>
          <p className="device-note">
            Payments happen your usual way. TabShare keeps the record.
          </p>
        </aside>
      </div>
    </>
  );
}
