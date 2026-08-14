"use client";

import Link from "next/link";

import { useAuth } from "@/lib/firebase/auth";
import type { Locale } from "@/lib/i18n";
import styles from "./SiteHeader.module.css";

/** Header entry point to the customer account area. */
export default function AccountLink({ locale }: { locale: Locale }) {
  const { user, loading } = useAuth();
  const signedIn = Boolean(user);

  const label = loading
    ? locale === "ar" ? "الحساب" : "Account"
    : signedIn
      ? locale === "ar" ? "حسابي" : "My account"
      : locale === "ar" ? "تسجيل الدخول" : "Sign in";

  return (
    <Link className={styles.accountLink} href="/account" aria-label={label}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      {/* A dot rather than a name: the header has very little room. */}
      {signedIn && <span className={styles.accountDot} aria-hidden="true" />}
    </Link>
  );
}
