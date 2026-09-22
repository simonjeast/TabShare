"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function AppShell({ children }) {
  const path = usePathname();
  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          TabShare
        </Link>
        <nav aria-label="Main navigation">
          <Link
            href="/"
            className={`sidebar-link ${path === "/" ? "current" : ""}`}
          >
            <span aria-hidden="true">⌂</span>Your groups
          </Link>
          <Link
            href="/groups/new"
            className={`sidebar-link ${path === "/groups/new" ? "current" : ""}`}
          >
            <span aria-hidden="true">＋</span>New group
          </Link>
          <Link href="/groups/demo" className="sidebar-link">
            <span aria-hidden="true">◉</span>Try a sample
          </Link>
        </nav>
        <div className="sidebar-note">
          <strong>
            Good people.
            <br />
            Great shared days.
          </strong>
          <p>Split life’s best moments.</p>
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
