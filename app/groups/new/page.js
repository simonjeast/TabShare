import Link from "next/link";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { isDatabaseConfigured } from "@/lib/db";

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
          <h1 className="display">Start with the group, not the ledger.</h1>
          <p className="lead">
            The onboarding form only asks for the minimum information needed to create a usable workspace: name,
            purpose, and members.
          </p>
          <div className="section-stack">
            <div className="metric-card">
              <span className="metric-label">Why this flow</span>
              <strong>Groups become usable immediately after creation.</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">What happens next</span>
              <strong>You land on the dashboard and can start logging expenses right away.</strong>
            </div>
          </div>
        </section>

        <section className="panel">
          {!databaseReady ? (
            <div className="banner warning">
              Connect a Postgres database in Vercel and set `POSTGRES_URL` or `DATABASE_URL` before creating live
              workspaces.
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

