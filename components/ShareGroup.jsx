"use client";
import { useState } from "react";
export function ShareGroup({ slug }) {
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState("");
  async function copy() {
    const url = `${window.location.origin}/groups/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Invitation link copied.");
    } catch {
      setFallback(url);
      setMessage("Copy the invitation link below.");
    }
  }
  return (
    <div className="share-group">
      <button className="secondary-button" type="button" onClick={copy}>
        Invite people ↗
      </button>
      <p className="helper-text">
        Keep this link safe. Anyone with it can add expenses and record
        payments.
      </p>
      <p role="status" className="helper-text">
        {message}
      </p>
      {fallback ? (
        <input
          aria-label="Invitation link"
          className="input"
          readOnly
          value={fallback}
          onFocus={(event) => event.target.select()}
        />
      ) : null}
    </div>
  );
}
