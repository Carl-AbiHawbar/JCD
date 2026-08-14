import type { Metadata } from "next";

import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "لوحة التحكم — JCD",
  // The dashboard should never appear in search results.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The provider lives in the root layout; this only adds the admin gate.
  return <AdminShell>{children}</AdminShell>;
}
