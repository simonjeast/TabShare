import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell">
      <div className="panel">
        <p className="eyebrow">Not Found</p>
        <h1 className="display">That workspace does not exist.</h1>
        <p className="lead">
          Check the URL, create a new group, or return to the main overview to start a fresh workspace.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" href="/groups/new">
            Create workspace
          </Link>
          <Link className="secondary-button" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

