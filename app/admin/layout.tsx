import type { Metadata } from "next";

import { AuthProvider } from "@/lib/firebase/auth";
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
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
