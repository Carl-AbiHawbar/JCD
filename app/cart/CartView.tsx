"use client";

import Link from "next/link";
import { useState } from "react";

import { formatPrice, useCart } from "@/lib/cart";
import { useAuth } from "@/lib/firebase/auth";
import { lookupDiscount, placeOrder } from "@/lib/firebase/public-writes";
import type { DiscountCode } from "@/lib/firebase/types";
import type { Locale } from "@/lib/i18n";
import { paymentUi } from "@/lib/payments";
import WhishPayment from "@/components/WhishPayment";
import styles from "./cart.module.css";

type State = { kind: "idle" | "sending" | "done" | "error"; message: string };

/** Wording is passed in so the page renders in whichever locale is active. */
type Strings = {
  cartEmpty: string; browse: string; loading: string;
  quantity: string; increase: string; decrease: string; remove: string;
  checkout: string; codeLabel: string; apply: string;
  codeBad: string; codeOk: (p: number) => string;
  fullName: string; phone: string; email: string; address: string;
  subtotal: string; discount: string; total: string;
  confirm: string; sending: string; codNote: string;
  failed: string; emptyCart: string;
  thanks: string; orderNumber: string; thanksNote: string; backToShop: string;
};

export default function CartView({
  t,
  locale,
}: {
  t: Strings;
  locale: Locale;
}) {
  const pay = paymentUi[locale];
  const [method, setMethod] = useState<"cod" | "whish">("cod");
  const { lines, subtotalCents, setQuantity, remove, clear, ready } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Prefill from the account once, without blocking later edits.
  const [prefilled, setPrefilled] = useState(false);
  if (user && !prefilled) {
    setPrefilled(true);
    if (user.displayName) setName(user.displayName);
    if (user.email) setEmail(user.email);
  }

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [codeNote, setCodeNote] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);

  const [state, setState] = useState<State>({ kind: "idle", message: "" });
  const [reference, setReference] = useState("");
  // Captured before the cart is emptied, so the confirmation can show it.
  const [paidCents, setPaidCents] = useState(0);

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
      setCodeNote(t.codeBad);
      return;
    }
    setDiscount(found);
    setCodeNote(t.codeOk(found.percent));
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
        userId: user?.uid ?? null,
      });
      setReference(ref);
      setPaidCents(totalCents);
      setState({ kind: "done", message: "" });
      clear();
    } catch (cause) {
      const empty = cause instanceof Error && cause.message === "EMPTY_CART";
      setState({ kind: "error", message: empty ? t.emptyCart : t.failed });
    }
  }

  if (!ready) return <p className={styles.empty}>{t.loading}</p>;

  if (state.kind === "done") {
    return (
      <div className={styles.done}>
        <h2 className={styles.doneHeading}>{t.thanks}</h2>
        <p>
          {t.orderNumber} <strong dir="ltr">{reference}</strong>
        </p>
        {method === "whish" ? (
          <WhishPayment
            locale={locale}
            amountLabel={formatPrice(paidCents)}
            reference={reference}
          />
        ) : (
          <p className={styles.doneNote}>{t.thanksNote}</p>
        )}
        <Link className={styles.primary} href="/#shop">
          {t.backToShop}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className={styles.done}>
        <p className={styles.empty}>{t.cartEmpty}</p>
        <Link className={styles.primary} href="/#shop">
          {t.browse}
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
                aria-label={t.decrease}
                onClick={() => setQuantity(line.productId, line.quantity - 1)}
              >
                −
              </button>
              <span aria-label={t.quantity}>{line.quantity}</span>
              <button
                type="button"
                aria-label={t.increase}
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
              {t.remove}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.checkout}>
        <h2 className={styles.checkoutHeading}>{t.checkout}</h2>

        <form className={styles.codeRow} onSubmit={applyCode}>
          <input
            className={styles.codeInput}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t.codeLabel}
            aria-label={t.codeLabel}
            dir="ltr"
          />
          <button
            className={styles.codeBtn}
            type="submit"
            disabled={checkingCode || code.trim().length === 0}
          >
            {checkingCode ? "…" : t.apply}
          </button>
        </form>
        {codeNote && (
          <p className={discount ? styles.codeOk : styles.codeBad} aria-live="polite">
            {codeNote}
          </p>
        )}

        <form className={styles.fields} onSubmit={submit}>
          <label className={styles.field}>
            <span>{t.fullName}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label className={styles.field}>
            <span>{t.phone}</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              dir="ltr"
              inputMode="tel"
            />
          </label>

          <label className={styles.field}>
            <span>{t.email}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              inputMode="email"
            />
          </label>

          <label className={styles.field}>
            <span>{t.address}</span>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <fieldset className={styles.methods}>
            <legend className={styles.methodsLegend}>{pay.method}</legend>
            <label className={styles.method}>
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <span>{pay.cod}</span>
            </label>
            <label className={styles.method}>
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "whish"}
                onChange={() => setMethod("whish")}
              />
              <span>{pay.whish}</span>
            </label>
          </fieldset>

          <dl className={styles.totals}>
            <div>
              <dt>{t.subtotal}</dt>
              <dd dir="ltr">{formatPrice(subtotalCents)}</dd>
            </div>
            {discount && (
              <div>
                <dt>
                  {t.discount} ({discount.percent}%)
                </dt>
                <dd dir="ltr">−{formatPrice(discountCents)}</dd>
              </div>
            )}
            <div className={styles.grandTotal}>
              <dt>{t.total}</dt>
              <dd dir="ltr">{formatPrice(totalCents)}</dd>
            </div>
          </dl>

          <button
            className={styles.primary}
            type="submit"
            disabled={state.kind === "sending"}
          >
            {state.kind === "sending" ? t.sending : t.confirm}
          </button>

          <p className={styles.payNote}>
            {method === "cod" ? t.codNote : pay.steps}
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
