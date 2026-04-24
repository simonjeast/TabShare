"use client";

import { useActionState } from "react";
import { createGroupAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState = {
  status: "idle",
  message: ""
};

export function CreateGroupForm({ disabled = false }) {
  const [state, formAction] = useActionState(createGroupAction, initialState);

  return (
    <form action={formAction} className="section-stack">
      <fieldset className="section-stack" disabled={disabled}>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="name">Group name</label>
            <input className="input" id="name" name="name" placeholder="Lisbon Apartment Trip" required />
          </div>

          <div className="field full">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              className="textarea"
              id="purpose"
              name="purpose"
              placeholder="Explain the trip, household, or project budget this workspace is tracking."
              required
            />
          </div>

          <div className="field full">
            <label htmlFor="members">Members</label>
            <textarea
              className="textarea"
              id="members"
              name="members"
              placeholder={"One name per line\nAva\nMarcus\nLena\nNoah"}
              required
            />
            <p className="helper-text">Enter between 2 and 12 members. One name per line keeps setup fast.</p>
          </div>
        </div>
      </fieldset>

      <p className={`feedback ${state.status === "error" ? "error" : ""}`}>{state.message}</p>

      <div className="stack-inline">
        <SubmitButton disabled={disabled} pendingLabel="Creating workspace...">
          Create workspace
        </SubmitButton>
        <span className="status-text">The app redirects to the dashboard after a successful write.</span>
      </div>

      {disabled ? (
        <p className="feedback error">Database connection required before this form can create a live workspace.</p>
      ) : null}
    </form>
  );
}
