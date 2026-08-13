/** Shared formatters for the dashboard. */

export function money(cents: number, currency = "USD") {
  const amount = cents / 100;
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return currency === "USD" ? `$${text}` : `${text} ${currency}`;
}

/** Firestore timestamps arrive as {seconds}; strings and Dates also work. */
export function toDate(value: unknown): Date | null {
  if (!value) return null;
  const seconds = (value as { seconds?: number }).seconds;
  if (typeof seconds === "number") return new Date(seconds * 1000);
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(value: unknown) {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
