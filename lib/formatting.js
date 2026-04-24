export function formatCurrencyFromCents(amountCents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format((amountCents ?? 0) / 100);
}

export function formatSignedCurrencyFromCents(amountCents) {
  if (amountCents === 0) {
    return formatCurrencyFromCents(0);
  }

  const prefix = amountCents >= 0 ? "+" : "-";
  return `${prefix}${formatCurrencyFromCents(Math.abs(amountCents))}`;
}

export function formatDate(value) {
  const resolvedDate =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00Z`) : new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(resolvedDate);
}
