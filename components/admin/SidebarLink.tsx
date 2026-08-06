"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "@/app/admin/admin.module.css";

export default function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      className={active ? styles.sidebarLinkActive : styles.sidebarLink}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
