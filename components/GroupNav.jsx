"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Overview", href: (slug) => `/groups/${slug}` },
  { label: "Ledger", href: (slug) => `/groups/${slug}/expenses` },
  { label: "Add Expense", href: (slug) => `/groups/${slug}/expenses/new` },
  { label: "Settlements", href: (slug) => `/groups/${slug}/settlements` },
];

export function GroupNav({ slug }) {
  const pathname = usePathname();

  return (
    <nav className="group-nav" aria-label="Group navigation">
      {links.map((link) => {
        const href = link.href(slug);
        const active = pathname === href;

        return (
          <Link
            key={href}
            className={`nav-link ${active ? "active" : ""}`}
            href={href}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
