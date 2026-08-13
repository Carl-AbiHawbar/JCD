"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/firebase/auth";
import LoginForm from "./LoginForm";
import styles from "./admin.module.css";

const NAV = [
  {
    label: "المتجر",
    items: [
      { href: "/admin/orders", label: "الطلبات" },
      { href: "/admin/products", label: "المنتجات" },
      { href: "/admin/discounts", label: "رموز الخصم" },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { href: "/admin/content/programs", label: "البرامج" },
      { href: "/admin/content/events", label: "الفعاليات" },
      { href: "/admin/content/faqs", label: "الأسئلة الشائعة" },
    ],
  },
  {
    label: "السجلات",
    items: [
      { href: "/admin/donations", label: "التبرعات" },
      { href: "/admin/subscribers", label: "المشتركون" },
      { href: "/admin/assessments", label: "تقييمات الجهوزية" },
    ],
  },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return <div className={styles.loginPage}>جارٍ التحقق…</div>;
  }

  // One gate for the whole dashboard. The rules deny the data regardless, so
  // this is for the experience rather than for security.
  if (!user || !isAdmin) {
    return <LoginForm signedInButNotAdmin={Boolean(user) && !isAdmin} />;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.brand}>لوحة التحكم</p>

        <Link
          className={pathname === "/admin" ? styles.navActive : styles.navLink}
          href="/admin"
        >
          نظرة عامة
        </Link>

        {NAV.map((group) => (
          <div className={styles.navGroup} key={group.label}>
            <p className={styles.navLabel}>{group.label}</p>
            {group.items.map((item) => (
              <Link
                key={item.href}
                className={
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? styles.navActive
                    : styles.navLink
                }
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        <div className={styles.sidebarFoot}>
          {user.email}
          <button className={styles.navLink} type="button" onClick={signOut}>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className={styles.main}>{children}</div>
    </div>
  );
}
