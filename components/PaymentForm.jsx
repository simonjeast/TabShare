"use client";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { recordPaymentAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { formatCurrencyFromCents as money } from "@/lib/formatting";
export function PaymentForm({ slug, payment }) {
  const [state, action] = useActionState(recordPaymentAction, { message: "" });
  const [requestId, setRequestId] = useState("");
  useEffect(() => setRequestId(crypto.randomUUID()), []);
  return (
    <section className="settlement-focus">
      <div className="payment-symbol" aria-hidden="true">
        ↔
      </div>
      <p className="payment-direction">
        <strong>{payment.fromName}</strong> pays{" "}
        <strong>{payment.toName}</strong>
      </p>
      <h2 className="payment-amount">{money(payment.amountCents)}</h2>
      <div className="payment-people">
        <span className="avatar">{payment.fromName.slice(0, 1)}</span>
        <span aria-hidden="true">→</span>
        <span className="avatar">{payment.toName.slice(0, 1)}</span>
      </div>
      <form action={action} className="payment-confirm">
        <input type="hidden" name="groupSlug" value={slug} />
        <input type="hidden" name="fromId" value={payment.fromId} />
        <input type="hidden" name="toId" value={payment.toId} />
        <input
          type="hidden"
          name="amount"
          value={(payment.amountCents / 100).toFixed(2)}
        />
        <input type="hidden" name="requestId" value={requestId} />
        <p>
          Record a payment made outside TabShare. This updates your balances; it
          doesn’t send money.
        </p>
        <label className="payment-check">
          <input type="checkbox" required />
          This payment has been made.
        </label>
        <p className="feedback error" role="status">
          {state.message}
        </p>
        <SubmitButton disabled={!requestId} pendingLabel="Recording…">
          Record payment
        </SubmitButton>
        <Link
          className="secondary-button payment-cancel"
          href={`/groups/${slug}`}
        >
          Cancel
        </Link>
      </form>
    </section>
  );
}
