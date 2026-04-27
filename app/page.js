import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">TS</span>
          <span className="brand-copy">
            TabShare
            <small>Shared expense tracking</small>
          </span>
        </Link>
        <div className="stack-inline">
          <Link className="pill-link" href="#flow">
            Flow
          </Link>
          <Link className="primary-button" href="/groups/new">
            Create workspace
          </Link>
        </div>
      </header>

      <section className="hero-grid hero-lift">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="status-dot" />
            Trip, household, and team spending
          </div>
          <h1>Share the tab. Settle the balance.</h1>
          <p className="lead">
            TabShare turns shared costs into a clean workspace: members, expenses, balances, and the shortest path to
            settling up.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/groups/new">
              Start a new group
            </Link>
            <Link className="secondary-button" href="#flow">
              See the flow
            </Link>
          </div>
          <div className="hero-proof">
            <span>Built for repeat use</span>
            <strong>Dashboard, ledger, and settlement plan in one routed app</strong>
          </div>
        </div>

        <aside className="hero-board" aria-label="Example group expense dashboard">
          <div className="board-topline">
            <div>
              <span className="mini-label">Lisbon weekend</span>
              <strong>$671.48</strong>
            </div>
            <span className="tag">4 members</span>
          </div>
          <div className="balance-bubbles" aria-hidden="true">
            <div className="balance-bubble bubble-large">
              <span>Ava</span>
              <strong>+$118</strong>
            </div>
            <div className="balance-bubble bubble-medium">
              <span>Noah</span>
              <strong>-$62</strong>
            </div>
            <div className="balance-bubble bubble-small">
              <span>Mia</span>
              <strong>+$24</strong>
            </div>
          </div>
          <div className="board-list">
            <div className="board-row">
              <span>Dinner</span>
              <strong>$96.00</strong>
            </div>
            <div className="board-row">
              <span>Apartment</span>
              <strong>$420.00</strong>
            </div>
            <div className="board-row settle">
              <span>Noah pays Ava</span>
              <strong>$62.27</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-stack" id="flow">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Features</p>
            <h2>Built for an easy user experience</h2>
          </div>
        </div>
        <div className="flow-grid">
          <article className="flow-card">
            <span className="step-index">1</span>
            <h3>Create the workspace</h3>
            <p>
              Set up a trip, household, or project with the people who need to split costs.
            </p>
          </article>
          <article className="flow-card">
            <span className="step-index">2</span>
            <h3>Capture the details</h3>
            <p>
              Record the amount, payer, category, date, notes, and the members included in each split.
            </p>
          </article>
          <article className="flow-card">
            <span className="step-index">3</span>
            <h3>Settle with confidence</h3>
            <p>
              Review balances and follow a minimal payment plan to clear the group.
            </p>
          </article>
        </div>
      </section>

      <section className="section-stack">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>The app feels more like a product than a spreadsheet.</h2>
          </div>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Fast dashboard scan</h3>
            <p>Total spend, latest activity, and member positions are visible without hunting through rows.</p>
          </article>
          <article className="feature-card">
            <h3>Focused ledger</h3>
            <p>Filters, categories, payer details, and notes keep the full expense history readable.</p>
          </article>
          <article className="feature-card">
            <h3>Calm settlement view</h3>
            <p>The final screen shows who pays whom, without asking users to decode balance math.</p>
          </article>
          <article className="feature-card">
            <h3>Solid backend flow</h3>
            <p>Server actions, validation, and cent-based calculations keep the interface grounded in reliable data.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
