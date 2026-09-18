"use client";
import { useActionState, useState, useEffect } from "react";
import { recordPaymentAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { formatCurrencyFromCents as money } from "@/lib/formatting";
export function PaymentForm({ slug, payment }) {
  const [state, action] = useActionState(recordPaymentAction, { message: "" });
  const [requestId, setRequestId] = useState("");
  useEffect(() => setRequestId(crypto.randomUUID()), []);
  return (
    <details className="payment-card">
      <summary>
        <span>
          <strong>{payment.fromName}</strong>
          <span className="muted"> pays </span>
          <strong>{payment.toName}</strong>
        </span>
        <strong>{money(payment.amountCents)}</strong>
        <span className="payment-cta">Record payment →</span>
      </summary>
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
          Confirm that {payment.fromName} has paid {payment.toName}{" "}
          <strong>{money(payment.amountCents)}</strong> outside TabShare. This
          only updates the group’s records; it doesn’t send money.
        </p>
        <label className="payment-check">
          <input type="checkbox" required /> This payment has been made.
        </label>
        <p className="feedback error" role="status">
          {state.message}
        </p>
        <SubmitButton disabled={!requestId} pendingLabel="Recording…">
          Confirm payment
        </SubmitButton>
      </form>
    </details>
  );
}
