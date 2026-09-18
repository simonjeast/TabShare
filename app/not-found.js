import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-shell">
      <div className="panel">
        <p className="eyebrow">Not Found</p>
        <h1 className="display">We couldn’t open that group.</h1>
        <p className="lead">
          Check that you have the full invitation link. Older group links may
          need to be replaced by the group organiser.
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
    </div>
  );
}
