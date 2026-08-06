"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart";
import styles from "./SiteHeader.module.css";

export default function CartLink() {
  const { count, ready } = useCart();

  return (
    <Link className={styles.cartLink} href="/cart" aria-label="سلة التسوق">
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
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {ready && count > 0 && <span className={styles.cartCount}>{count}</span>}
    </Link>
  );
}
