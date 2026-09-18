"use client";
import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { createExpenseAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { categories } from "@/lib/validation";
import { splitAmountAcrossParticipants } from "@/lib/calculations";
import { formatCurrencyFromCents as money } from "@/lib/formatting";
import { readSavedGroups } from "@/lib/saved-groups";
export function ExpenseForm({ groupSlug, members }) {
  const [state, action] = useActionState(createExpenseAction, { message: "" });
  const [fields, setFields] = useState({
    title: "",
    amount: "",
    payerMemberId: members[0]?.id || "",
    category: "Other",
    spentOn: "",
    notes: "",
  });
  const [selected, setSelected] = useState(members.map((member) => member.id));
  useEffect(() => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const saved = readSavedGroups().find((group) => group.slug === groupSlug);
    setFields((previous) => ({
      ...previous,
      spentOn: date,
      payerMemberId: members.some((member) => member.id === saved?.memberId)
        ? saved.memberId
        : previous.payerMemberId,
    }));
  }, [groupSlug]);
  const change = (event) =>
    setFields((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const cents = Math.round(Number(fields.amount) * 100);
  const shares =
    Number.isSafeInteger(cents) && cents > 0 && cents <= 5000000
      ? splitAmountAcrossParticipants(
          cents,
          members.filter((member) => selected.includes(member.id)),
        )
      : [];
  return (
    <form action={action} className="section-stack">
      <input type="hidden" name="groupSlug" value={groupSlug} />
      <div className="field">
        <label htmlFor="title">What was it for?</label>
        <input
          className="input"
          id="title"
          name="title"
          value={fields.title}
          onChange={change}
          placeholder="e.g. Saturday dinner"
          minLength={3}
          maxLength={80}
          required
          autoFocus
        />
      </div>
      <div className="field">
        <label htmlFor="amount">
          Amount <span className="muted">· USD</span>
        </label>
        <div className="amount-input">
          <span>$</span>
          <input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            value={fields.amount}
            onChange={change}
            min="0.01"
            max="50000"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="payer">Paid by</label>
        <select
          id="payer"
          name="payerMemberId"
          className="select"
          value={fields.payerMemberId}
          onChange={change}
        >
          {members.map((member) => (
            <option value={member.id} key={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="split-fieldset">
        <legend>Split equally between</legend>
        <div className="split-people">
          {members.map((member) => (
            <label key={member.id} className="split-person">
              <input
                type="checkbox"
                name="participantIds"
                value={member.id}
                checked={selected.includes(member.id)}
                onChange={(event) =>
                  setSelected((previous) =>
                    event.target.checked
                      ? [...previous, member.id]
                      : previous.filter((id) => id !== member.id),
                  )
                }
              />
              <span className="avatar">{member.name.slice(0, 1)}</span>
              <span>{member.name}</span>
              <strong>
                {shares.find((share) => share.memberId === member.id)
                  ? money(
                      shares.find((share) => share.memberId === member.id)
                        .shareCents,
                    )
                  : "—"}
              </strong>
            </label>
          ))}
        </div>
        <div className="split-summary" aria-live="polite">
          {!selected.length
            ? "Choose at least one person."
            : `${selected.length} ${selected.length === 1 ? "person" : "people"} · Split equally${cents > 0 && selected.length && cents % selected.length ? " · Extra cents are included above" : ""}`}
        </div>
      </fieldset>
      <details className="optional-details">
        <summary>
          Category, date & notes <span>Optional details</span>
        </summary>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              className="select"
              id="category"
              name="category"
              value={fields.category}
              onChange={change}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="spentOn">Date</label>
            <input
              className="input"
              type="date"
              id="spentOn"
              name="spentOn"
              value={fields.spentOn}
              onChange={change}
            />
          </div>
          <div className="field full">
            <label htmlFor="notes">Notes</label>
            <textarea
              className="textarea"
              id="notes"
              name="notes"
              maxLength={220}
              value={fields.notes}
              onChange={change}
              placeholder="Anything the group should know"
            />
          </div>
        </div>
      </details>
      <p className="feedback error" role="status">
        {state.message}
      </p>
      <div className="form-actions">
        <Link className="secondary-button" href={`/groups/${groupSlug}`}>
          Cancel
        </Link>
        <SubmitButton
          disabled={!selected.length || !fields.spentOn}
          pendingLabel="Saving…"
        >
          Save expense
        </SubmitButton>
      </div>
    </form>
  );
}
