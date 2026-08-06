import Link from "next/link";

import SidebarLink from "@/components/admin/SidebarLink";
import { getCurrentAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NAV_SECTIONS } from "@/lib/admin/resources";
import { signOut } from "./actions";
import styles from "./admin.module.css";

export const metadata = { title: "لوحة التحكم — JCD" };

/* Every admin route depends on the caller's session, so none of them can be
   prerendered — and at build time there may be no Supabase config at all. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!isSupabaseConfigured) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>الإعداد غير مكتمل</h1>
          <div className={styles.notice}>
            لوحة التحكم تحتاج إلى الاتصال بـ Supabase. انسخ{" "}
            <code>.env.local.example</code> إلى <code>.env.local</code> واملأ
            القيم، ثم أعد تشغيل الخادم.
          </div>
        </div>
      </div>
    );
  }

  // The login page renders its own chrome and must stay reachable while
  // signed out, so the shell only wraps authenticated pages.
  const admin = await getCurrentAdmin();
  if (!admin) return <>{children}</>;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.sidebarBrand} href="/admin">
          لوحة التحكم
        </Link>

        {NAV_SECTIONS.map((section) => (
          <div className={styles.sidebarSection} key={section.label}>
            <span className={styles.sidebarLabel}>{section.label}</span>
            {section.items.map((item) => (
              <SidebarLink key={item.href} href={item.href} label={item.label} />
            ))}
          </div>
        ))}

        <div className={styles.sidebarFoot}>
          {admin.email}
          <form action={signOut}>
            <button className={styles.sidebarLink} type="submit">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      <div className={styles.main}>{children}</div>
    </div>
  );
}
