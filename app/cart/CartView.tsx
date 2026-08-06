"use client";

import Link from "next/link";
import { useState } from "react";

import { formatPrice, useCart } from "@/lib/cart";
import styles from "./cart.module.css";

type State = { kind: "idle" | "sending" | "done" | "error"; message: string };

export default function CartView() {
  const { lines, subtotalCents, setQuantity, remove, clear, ready } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState<State>({ kind: "idle", message: "" });
  const [reference, setReference] = useState("");

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    setState({ kind: "sending", message: "" });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          lines: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        reference?: string;
      };
      if (!response.ok) throw new Error(body.error);

      setReference(body.reference ?? "");
      setState({ kind: "done", message: "تم استلام طلبك." });
      clear();
    } catch (cause) {
      setState({
        kind: "error",
        message:
          cause instanceof Error && cause.message
            ? cause.message
            : "تعذّر إتمام الطلب.",
      });
    }
  }

  if (!ready) return <p className={styles.empty}>جارٍ التحميل...</p>;

  if (state.kind === "done") {
    return (
      <div className={styles.done}>
        <h2 className={styles.doneHeading}>شكراً لك، تم استلام طلبك.</h2>
        <p>
          رقم الطلب: <strong dir="ltr">{reference}</strong>
        </p>
        <p className={styles.doneNote}>سنتواصل معك لتأكيد التفاصيل والتسليم.</p>
        <Link className={styles.primary} href="/#shop">
          العودة إلى المتجر
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={styles.done}>
        <p className={styles.empty}>سلتك فارغة.</p>
        <Link className={styles.primary} href="/#shop">
          تصفّح المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <ul className={styles.lines}>
        {lines.map((line) => (
          <li className={styles.line} key={line.productId}>
            <div className={styles.lineMain}>
              <h3 className={styles.lineTitle}>{line.title}</h3>
              <p className={styles.linePrice} dir="ltr">
                {formatPrice(line.priceCents)}
              </p>
            </div>

            <div className={styles.qty}>
              <button
                type="button"
                aria-label="إنقاص الكمية"
                onClick={() => setQuantity(line.productId, line.quantity - 1)}
              >
                −
              </button>
              <span aria-label="الكمية">{line.quantity}</span>
              <button
                type="button"
                aria-label="زيادة الكمية"
                onClick={() => setQuantity(line.productId, line.quantity + 1)}
              >
                +
              </button>
            </div>

            <p className={styles.lineTotal} dir="ltr">
              {formatPrice(line.priceCents * line.quantity)}
            </p>

            <button
              className={styles.removeBtn}
              type="button"
              onClick={() => remove(line.productId)}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>

      <form className={styles.checkout} onSubmit={placeOrder}>
        <h2 className={styles.checkoutHeading}>إتمام الطلب</h2>

        <label className={styles.field}>
          <span>الاسم الكامل *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className={styles.field}>
          <span>رقم الهاتف *</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            dir="ltr"
          />
        </label>

        <label className={styles.field}>
          <span>البريد الإلكتروني</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
          />
        </label>

        <label className={styles.field}>
          <span>العنوان</span>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <p className={styles.total}>
          المجموع: <strong dir="ltr">{formatPrice(subtotalCents)}</strong>
        </p>

        <button
          className={styles.primary}
          type="submit"
          disabled={state.kind === "sending"}
        >
          {state.kind === "sending" ? "جارٍ الإرسال..." : "تأكيد الطلب"}
        </button>

        <p className={styles.payNote}>
          الدفع عند الاستلام. سنتواصل معك لتأكيد الطلب.
        </p>

        {state.kind === "error" && (
          <p className={styles.error} aria-live="polite">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
