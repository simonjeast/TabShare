"use client";

import { useActionState, useState } from "react";
import { createExpenseAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { categories } from "@/lib/validation";

const initialState = {
  status: "idle",
  message: "",
};

export function ExpenseForm({ groupSlug, members }) {
  const [fields, setFields] = useState({
    title: "",
    amount: "",
    notes: "",
    category: "Food",
    spentOn: new Date().toISOString().slice(0, 10),
    payerMemberId: members[0]?.id ?? "",
  });
  const [selected, setSelected] = useState(members.map((member) => member.id));
  const change = (event) =>
    setFields((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const [state, formAction] = useActionState(createExpenseAction, initialState);

  return (
    <form action={formAction} className="section-stack">
      <input name="groupSlug" type="hidden" value={groupSlug} />

      <div className="form-grid wide">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            className="input"
            id="title"
            name="title"
            value={fields.title}
            onChange={change}
            placeholder="Saturday dinner"
            minLength={3}
            maxLength={80}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            className="input"
            id="amount"
            name="amount"
            value={fields.amount}
            onChange={change}
            min="0.01"
            max="50000"
            step="0.01"
            placeholder="96.00"
            required
            type="number"
          />
        </div>

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
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="spentOn">Date</label>
          <input
            className="input"

            id="spentOn"
            name="spentOn"
            value={fields.spentOn}
            onChange={change}
            required
            type="date"
          />
        </div>

        <div className="field">
          <label htmlFor="payerMemberId">Paid by</label>
          <select
            className="select"
            id="payerMemberId"
            name="payerMemberId"
            value={fields.payerMemberId}
            onChange={change}
            required
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field full">
          <label htmlFor="notes">Notes</label>
          <textarea
            className="textarea"
            id="notes"
            maxLength={220}
            name="notes"
            value={fields.notes}
            onChange={change}
            placeholder="Optional context, such as restaurant name, reservation, or anything useful for the audit trail."
          />
        </div>

        <div className="field full">
          <span className="fieldset-label">
            Split between · {selected.length} selected
          </span>
          <div className="checkbox-grid">
            {members.map((member) => (
              <label className="checkbox-chip" key={member.id}>
                <input
                  checked={selected.includes(member.id)}
                  onChange={(event) =>
                    setSelected((previous) =>
                      event.target.checked
                        ? [...previous, member.id]
                        : previous.filter((id) => id !== member.id),
                    )
                  }
                  name="participantIds"
                  type="checkbox"
                  value={member.id}
                />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`feedback ${state.status === "error" ? "error" : ""}`}
      >
        {state.message}
      </p>

      <div className="stack-inline">
        <SubmitButton pendingLabel="Saving expense...">
          Save expense
        </SubmitButton>
        <span className="status-text">
          Your group’s balances update when you save.
        </span>
      </div>
    </form>
  );
}
