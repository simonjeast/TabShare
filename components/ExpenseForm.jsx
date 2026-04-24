"use client";

import { useActionState } from "react";
import { createExpenseAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { categories } from "@/lib/validation";

const initialState = {
  status: "idle",
  message: ""
};

export function ExpenseForm({ groupSlug, members }) {
  const [state, formAction] = useActionState(createExpenseAction, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="section-stack">
      <input name="groupSlug" type="hidden" value={groupSlug} />

      <div className="form-grid wide">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input className="input" id="title" name="title" placeholder="Saturday dinner" required />
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input className="input" id="amount" name="amount" min="0.01" step="0.01" placeholder="96.00" required type="number" />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select className="select" defaultValue="Food" id="category" name="category">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="spentOn">Date</label>
          <input className="input" defaultValue={today} id="spentOn" name="spentOn" required type="date" />
        </div>

        <div className="field">
          <label htmlFor="payerMemberId">Paid by</label>
          <select className="select" id="payerMemberId" name="payerMemberId" required>
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
            name="notes"
            placeholder="Optional context, such as restaurant name, reservation, or anything useful for the audit trail."
          />
        </div>

        <div className="field full">
          <span className="fieldset-label">Split between</span>
          <div className="checkbox-grid">
            {members.map((member) => (
              <label className="checkbox-chip" key={member.id}>
                <input defaultChecked name="participantIds" type="checkbox" value={member.id} />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <p className={`feedback ${state.status === "error" ? "error" : ""}`}>{state.message}</p>

      <div className="stack-inline">
        <SubmitButton pendingLabel="Saving expense...">Save expense</SubmitButton>
        <span className="status-text">Balances and settlement suggestions refresh immediately after the redirect.</span>
      </div>
    </form>
  );
}

