import Link from "next/link";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function NewGroupPage() {
  const databaseReady = isDatabaseConfigured();

  return (
    <main className="site-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">TS</span>
          <span className="brand-copy">
            TabShare
            <small>Create a new expense workspace</small>
          </span>
        </Link>
        <Link className="pill-link" href="/">
          Back home
        </Link>
      </header>

      <div className="two-column">
        <section className="panel">
          <p className="eyebrow">Setup</p>
          <h1 className="display">Who’s splitting the tab?</h1>
          <p className="lead">
            Bring your people together in one place. Give your group a name, add
            everyone, and start with your first shared expense.
          </p>
          <div className="section-stack">
            <div className="metric-card">
              <span className="metric-label">01 / Make it yours</span>
              <strong>Trips, flatmates, dinners. One group for each.</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">02 / Start sharing</span>
              <strong>
                Add an expense and we’ll work out each person’s share.
              </strong>
            </div>
          </div>
        </section>

        <section className="panel">
          {!databaseReady ? (
            <div className="banner warning">
              Group creation is temporarily unavailable. You can still explore
              the sample group from the home page.
            </div>
          ) : null}

          <div className="panel-title-row">
            <div>
              <p className="eyebrow">Workspace Details</p>
              <h2>Create the group</h2>
            </div>
          </div>
          <CreateGroupForm disabled={!databaseReady} />
        </section>
      </div>
    </main>
  );
}
