import Link from "next/link";
export function FlowSteps({ step, slug }) {
  const items = [
    ["Your groups", "/"],
    ["Group expenses", slug ? `/groups/${slug}` : null],
    ["Add an expense", slug ? `/groups/${slug}/expenses/new` : null],
    ["Settle up", slug ? `/groups/${slug}/settlements` : null],
  ];
  return (
    <nav className="flow-steps" aria-label="Expense sharing steps">
      {items.map(([label, href], index) => (
        <div
          key={label}
          className={
            index + 1 === step ? "active" : index + 1 < step ? "complete" : ""
          }
        >
          {href ? (
            <Link
              href={href}
              aria-current={index + 1 === step ? "step" : undefined}
            >
              <span>{index + 1}</span>
              {label}
            </Link>
          ) : (
            <span className="future-step">
              <span>{index + 1}</span>
              {label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
