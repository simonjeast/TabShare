import Link from "next/link";
export function AppShell({ children }) {
  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">t.</span>TabShare
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/" className="sidebar-link">
            Your groups
          </Link>
          <Link href="/groups/new" className="sidebar-link subtle">
            + Create a group
          </Link>
        </nav>
        <div className="sidebar-note">
          <strong>A little less keeping score.</strong>
          <p>Shared expenses, clear balances.</p>
          <span>No accounts. Just your group link.</span>
        </div>
      </aside>
      <main id="main" className="app-content">
        {children}
        <footer className="app-footer">
          <span>TabShare · Shared expenses for real life</span>
          <span>USD · Payments happen outside TabShare</span>
        </footer>
      </main>
    </div>
  );
}
