"use client";

import { useActionState, useState } from "react";
import { createGroupAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialState = {
  status: "idle",
  message: "",
};

export function CreateGroupForm({ disabled = false }) {
  const [fields, setFields] = useState({ name: "", purpose: "", members: "" });
  const change = (event) =>
    setFields((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  const [state, formAction] = useActionState(createGroupAction, initialState);

  return (
    <form action={formAction} className="section-stack">
      <fieldset className="section-stack" disabled={disabled}>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="name">Group name</label>
            <input
              className="input"
              id="name"
              name="name"
              value={fields.name}
              onChange={change}
              minLength={3}
              maxLength={60}
              placeholder="Lisbon Apartment Trip"
              required
            />
          </div>

          <div className="field full">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              className="textarea"
              id="purpose"
              name="purpose"
              value={fields.purpose}
              onChange={change}
              minLength={12}
              maxLength={220}
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
              value={fields.members}
              onChange={change}
              placeholder={"One name per line\nAva\nMarcus\nLena\nNoah"}
              required
            />
            <p className="helper-text">
              Enter between 2 and 12 members. One name per line keeps setup
              fast.
            </p>
          </div>
        </div>
      </fieldset>

      <p
        role="status"
        aria-live="polite"
        className={`feedback ${state.status === "error" ? "error" : ""}`}
      >
        {state.message}
      </p>

      <div className="stack-inline">
        <SubmitButton disabled={disabled} pendingLabel="Creating workspace...">
          Create workspace
        </SubmitButton>
        <span className="status-text">
          Anyone with your invitation link can view and add expenses. Save it to
          return to your group.
        </span>
      </div>

      {disabled ? (
        <p className="feedback error">
          Please try again later. Your group has not been created.
        </p>
      ) : null}
    </form>
  );
}
