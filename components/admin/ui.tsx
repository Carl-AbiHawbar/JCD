import styles from "@/app/admin/admin.module.css";

const STATUS_LABELS: Record<string, string> = {
  published: "منشور",
  draft: "مسودة",
  archived: "مؤرشف",
  pending: "قيد الانتظار",
  paid: "مدفوع",
  fulfilled: "تم التنفيذ",
  cancelled: "ملغى",
  refunded: "مُسترد",
};

const STATUS_STYLES: Record<string, string> = {
  published: styles.badgePublished,
  paid: styles.badgePublished,
  fulfilled: styles.badgePublished,
  draft: styles.badgeDraft,
  archived: styles.badgeArchived,
  cancelled: styles.badgeArchived,
  refunded: styles.badgeArchived,
  pending: styles.badgeWarn,
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={STATUS_STYLES[status] ?? styles.badgeDraft}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

/** Prices are stored as integer minor units to avoid float drift. */
export function formatPrice(cents: number, currency = "LBP") {
  return new Intl.NumberFormat("ar", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

/** Renders whatever a generic list column holds, without knowing its type. */
export function Cell({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") return <>—</>;
  if (typeof value === "string" && STATUS_LABELS[value]) {
    return <StatusBadge status={value} />;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return <>{formatDate(value)}</>;
  }
  return <>{String(value)}</>;
}
