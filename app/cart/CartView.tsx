"use client";

import Link from "next/link";
import { useState } from "react";

import { formatPrice, useCart } from "@/lib/cart";
import { lookupDiscount, placeOrder } from "@/lib/firebase/public-writes";
import type { DiscountCode } from "@/lib/firebase/types";
import styles from "./cart.module.css";

type State = { kind: "idle" | "sending" | "done" | "error"; message: string };

export default function CartView() {
  const { lines, subtotalCents, setQuantity, remove, clear, ready } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [codeNote, setCodeNote] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);

  const [state, setState] = useState<State>({ kind: "idle", message: "" });
  const [reference, setReference] = useState("");

  const discountCents = discount
    ? Math.round(subtotalCents * (discount.percent / 100))
    : 0;
  const totalCents = subtotalCents - discountCents;

  async function applyCode(event: React.FormEvent) {
    event.preventDefault();
    setCheckingCode(true);
    setCodeNote("");

    const found = await lookupDiscount(code);
    setCheckingCode(false);

    if (!found) {
      setDiscount(null);
      setCodeNote("الرمز غير صالح أو منتهي الصلاحية.");
      return;
    }
    setDiscount(found);
    setCodeNote(`تم تطبيق خصم ${found.percent}%`);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ kind: "sending", message: "" });

    try {
      const ref = await placeOrder({
        name,
        phone,
        email,
        address,
        lines,
        discount,
      });
      setReference(ref);
      setState({ kind: "done", message: "" });
      clear();
    } catch (cause) {
      const empty = cause instanceof Error && cause.message === "EMPTY_CART";
      setState({
        kind: "error",
        message: empty
          ? "السلة فارغة."
          : "تعذّر إتمام الطلب. يرجى المحاولة لاحقاً.",
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
        <p className={styles.doneNote}>
          الدفع عند الاستلام. سنتواصل معك لتأكيد التفاصيل والتسليم.
        </p>
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

      <div className={styles.checkout}>
        <h2 className={styles.checkoutHeading}>إتمام الطلب</h2>

        <form className={styles.codeRow} onSubmit={applyCode}>
          <input
            className={styles.codeInput}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="رمز الخصم"
            aria-label="رمز الخصم"
            dir="ltr"
          />
          <button
            className={styles.codeBtn}
            type="submit"
            disabled={checkingCode || code.trim().length === 0}
          >
            {checkingCode ? "..." : "تطبيق"}
          </button>
        </form>
        {codeNote && (
          <p className={discount ? styles.codeOk : styles.codeBad} aria-live="polite">
            {codeNote}
          </p>
        )}

        <form className={styles.fields} onSubmit={submit}>
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
              inputMode="tel"
            />
          </label>

          <label className={styles.field}>
            <span>البريد الإلكتروني</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              inputMode="email"
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

          <dl className={styles.totals}>
            <div>
              <dt>المجموع الفرعي</dt>
              <dd dir="ltr">{formatPrice(subtotalCents)}</dd>
            </div>
            {discount && (
              <div>
                <dt>الخصم ({discount.percent}%)</dt>
                <dd dir="ltr">−{formatPrice(discountCents)}</dd>
              </div>
            )}
            <div className={styles.grandTotal}>
              <dt>الإجمالي</dt>
              <dd dir="ltr">{formatPrice(totalCents)}</dd>
            </div>
          </dl>

          <button
            className={styles.primary}
            type="submit"
            disabled={state.kind === "sending"}
          >
            {state.kind === "sending" ? "جارٍ الإرسال..." : "تأكيد الطلب"}
          </button>

          <p className={styles.payNote}>
            الدفع عند الاستلام (COD). لا يتم تحصيل أي مبلغ عبر الموقع.
          </p>

          {state.kind === "error" && (
            <p className={styles.error} aria-live="polite">
              {state.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
