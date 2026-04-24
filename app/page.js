import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">TS</span>
          <span className="brand-copy">
            TabShare
            <small>Shared expenses with a cleaner operational flow</small>
          </span>
        </Link>
        <div className="stack-inline">
          <Link className="pill-link" href="#flow">
            Product flow
          </Link>
          <Link className="primary-button" href="/groups/new">
            Create workspace
          </Link>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Shared spending, routed properly</p>
          <h1>Track a group budget from setup to settlement without losing the thread.</h1>
          <p className="lead">
            TabShare is a full-stack expense workspace for trips, roommates, and collaborative budgets. Create a
            group, add members, record payments, review the ledger, and finish with a clear settlement plan.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/groups/new">
              Start a new group
            </Link>
            <Link className="secondary-button" href="#flow">
              See the UX flow
            </Link>
          </div>
        </div>

        <aside className="hero-preview">
          <p className="eyebrow">Snapshot</p>
          <div className="preview-shell">
            <div className="preview-summary">
              <div className="preview-stat">
                <span>Active members</span>
                <strong>4</strong>
              </div>
              <div className="preview-stat">
                <span>Total logged</span>
                <strong>$671.48</strong>
              </div>
              <div className="preview-stat">
                <span>Settlements</span>
                <strong>3</strong>
              </div>
            </div>
            <div className="preview-list">
              <div className="preview-item">
                <span>Latest expense</span>
                <strong>Saturday dinner · $96.00</strong>
              </div>
              <div className="preview-item">
                <span>Largest receiver</span>
                <strong>Ava · +$118.41</strong>
              </div>
              <div className="preview-item">
                <span>Next payment</span>
                <strong>Noah pays Ava · $62.27</strong>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-stack" id="flow">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Flow</p>
            <h2>Built around the order users actually work in</h2>
          </div>
          <p className="support-copy">
            The UI is structured as a sequence of routed steps instead of a single overloaded page.
          </p>
        </div>
        <div className="flow-grid">
          <article className="flow-card">
            <span className="step-index">1</span>
            <h3>Create the workspace</h3>
            <p>
              Define the trip or household, add the member list, and land directly on a server-rendered dashboard with
              real balances.
            </p>
          </article>
          <article className="flow-card">
            <span className="step-index">2</span>
            <h3>Capture expenses cleanly</h3>
            <p>
              Record who paid, when it happened, what category it belongs to, and exactly which members were included
              in the split.
            </p>
          </article>
          <article className="flow-card">
            <span className="step-index">3</span>
            <h3>Review and settle</h3>
            <p>
              Move from overview to ledger to settlements without losing context. Each page is tuned to a specific job.
            </p>
          </article>
        </div>
      </section>

      <section className="section-stack">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">What Changed</p>
            <h2>From class demo to deployable application</h2>
          </div>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Next.js App Router</h3>
            <p>Dedicated routes for onboarding, dashboard, ledger, expense capture, and settlements.</p>
          </article>
          <article className="feature-card">
            <h3>Server-side persistence</h3>
            <p>Group data is stored in Postgres through a backend layer designed for Vercel deployment.</p>
          </article>
          <article className="feature-card">
            <h3>Validation at the edge of the system</h3>
            <p>Server actions and API routes validate payloads before writing to the database.</p>
          </article>
          <article className="feature-card">
            <h3>Deterministic balance math</h3>
            <p>Amounts are stored in cents, split evenly with remainder handling, and turned into a minimal settlement plan.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
