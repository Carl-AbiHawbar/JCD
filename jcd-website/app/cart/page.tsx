import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartView from "./CartView";
import styles from "./cart.module.css";

export const metadata: Metadata = {
  title: "سلة التسوق",
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.heading}>سلة التسوق</h1>
          <CartView />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
