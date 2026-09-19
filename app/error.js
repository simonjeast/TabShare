"use client";
import Link from "next/link";
export default function ErrorPage({ reset }) {
  return (
    <div className="site-shell">
      <section className="panel" role="alert">
        <p className="eyebrow">Something went wrong</p>
        <h1>Let’s try that again.</h1>
        <p className="lead">
          We couldn’t load this page. If you were saving an expense, check the
          ledger before adding it again.
        </p>
        <div className="stack-inline">
          <button className="primary-button" onClick={reset}>
            Try again
          </button>
          <Link className="secondary-button" href="/">
            Back to TabShare
          </Link>
        </div>
      </section>
    </div>
  );
}
