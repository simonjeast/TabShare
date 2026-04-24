"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingLabel, disabled = false }) {
  const { pending } = useFormStatus();

  return (
    <button className="submit-button" type="submit" disabled={pending || disabled}>
      {pending ? pendingLabel : children}
    </button>
  );
}
