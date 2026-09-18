"use client";
import { useActionState, useState } from "react";
import { createGroupAction } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
export function CreateGroupForm({ disabled = false }) {
  const [state, action] = useActionState(createGroupAction, { message: "" });
  const [name, setName] = useState("");
  const [you, setYou] = useState("");
  const [friends, setFriends] = useState([""]);
  const [purpose, setPurpose] = useState("");
  return (
    <form action={action} className="section-stack">
      <fieldset disabled={disabled}>
        <div className="field">
          <label htmlFor="group-name">Group name</label>
          <input
            className="input"
            id="group-name"
            name="name"
            placeholder="e.g. Coastal weekend"
            required
            minLength={3}
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-section">
          <h2>Who’s in?</h2>
          <p className="helper-text">
            Add yourself and the people sharing expenses. You can share the
            group link once it’s created.
          </p>
          <div className="field">
            <label htmlFor="your-name">Your name</label>
            <input
              className="input"
              id="your-name"
              name="yourName"
              placeholder="Your name"
              autoComplete="given-name"
              required
              minLength={2}
              maxLength={40}
              value={you}
              onChange={(event) => setYou(event.target.value)}
            />
          </div>
          <input type="hidden" name="members" value={friends.join("\n")} />
          {friends.map((friend, index) => (
            <div className="friend-field" key={index}>
              <label htmlFor={`friend-${index}`}>Person {index + 2}</label>
              <div className="join-input">
                <input
                  className="input"
                  id={`friend-${index}`}
                  placeholder="Their name"
                  minLength={2}
                  maxLength={40}
                  required
                  value={friend}
                  onChange={(event) =>
                    setFriends((previous) =>
                      previous.map((value, i) =>
                        i === index ? event.target.value : value,
                      ),
                    )
                  }
                />
                {friends.length > 1 ? (
                  <button
                    type="button"
                    className="remove-person"
                    aria-label={`Remove person ${index + 2}`}
                    onClick={() =>
                      setFriends((previous) =>
                        previous.filter((_, i) => i !== index),
                      )
                    }
                  >
                    ×
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {friends.length < 11 ? (
            <button
              type="button"
              className="text-link"
              onClick={() => setFriends((previous) => [...previous, ""])}
            >
              + Add another person
            </button>
          ) : null}
        </div>
        <details className="optional-details">
          <summary>
            Add a description <span>Optional</span>
          </summary>
          <textarea
            className="textarea"
            name="purpose"
            aria-label="Group description"
            maxLength={220}
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            placeholder="What’s the plan?"
          />
        </details>
      </fieldset>
      <p className="feedback error" role="status">
        {state.message}
      </p>
      <SubmitButton disabled={disabled} pendingLabel="Creating your group…">
        Create group →
      </SubmitButton>
      <p className="form-footnote">
        Anyone with the invitation link can view expenses and record payments.
        Keep the link with your group. All amounts are in USD.
      </p>
    </form>
  );
}
