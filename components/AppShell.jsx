import Link from "next/link";
export function AppShell({ children }) {
  return (
    <div className="app-frame">
      <header className="app-topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">t.</span>TabShare
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/">Your groups</Link>
          <Link href="/groups/demo">Try the demo</Link>
        </nav>
      </header>
      <main id="main" className="app-content">
        {children}
        <footer className="app-footer">
          <span>TabShare</span>
          <span>USD · Payments happen outside TabShare</span>
        </footer>
      </main>
    </div>
  );
}
