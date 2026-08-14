"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { formatPrice } from "@/lib/cart";
import { authErrorMessage, displayNameOf, signUpCustomer } from "@/lib/firebase/accounts";
import { useAuth } from "@/lib/firebase/auth";
import { listMyOrders } from "@/lib/firebase/customer";
import type { OrderWithItems } from "@/lib/firebase/types";
import styles from "./account.module.css";

export type AccountStrings = {
  signIn: string; signUp: string; signOut: string;
  email: string; password: string; name: string;
  haveAccount: string; noAccount: string;
  or: string; google: string;
  welcome: string; myOrders: string; noOrders: string;
  browse: string; loading: string; working: string;
  orderNumber: string; date: string; total: string; status: string;
  statuses: Record<string, string>;
};

export default function AccountView({ t }: { t: AccountStrings }) {
  const { user, loading, signInWithPassword, signInWithGoogle, signOut } = useAuth();

  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadOrders = useCallback(async (uid: string) => {
    setOrdersLoading(true);
    try {
      setOrders(await listMyOrders(uid));
    } catch {
      // Before the rules are deployed this is denied; an empty history is a
      // better outcome here than an error the shopper cannot act on.
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadOrders(user.uid);
    else setOrders([]);
  }, [user, loadOrders]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "up") await signUpCustomer({ name, email, password });
      else await signInWithPassword(email, password);
    } catch (cause) {
      setError(authErrorMessage(cause, t.signIn === "Sign in" ? "en" : "ar"));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (cause) {
      setError(authErrorMessage(cause, t.signIn === "Sign in" ? "en" : "ar"));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className={styles.muted}>{t.loading}</p>;

  /* ------------------------------------------------------------- signed in */

  if (user) {
    return (
      <div className={styles.stack}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {t.welcome} {displayNameOf(user)}
          </h2>
          <p className={styles.muted} dir="ltr">
            {user.email}
          </p>
          <button className={styles.secondary} type="button" onClick={signOut}>
            {t.signOut}
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{t.myOrders}</h2>

          {ordersLoading ? (
            <p className={styles.muted}>{t.loading}</p>
          ) : orders.length === 0 ? (
            <>
              <p className={styles.muted}>{t.noOrders}</p>
              <Link className={styles.primary} href="/#shop">
                {t.browse}
              </Link>
            </>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t.orderNumber}</th>
                    <th>{t.date}</th>
                    <th>{t.total}</th>
                    <th>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td dir="ltr">{order.reference}</td>
                      <td>
                        {order.createdAt
                          ? new Date(
                              (order.createdAt as unknown as { seconds: number })
                                .seconds * 1000,
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td dir="ltr">{formatPrice(order.totalCents)}</td>
                      <td>{t.statuses[order.status] ?? order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------ signed out */

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{mode === "in" ? t.signIn : t.signUp}</h2>

      <form className={styles.form} onSubmit={submit}>
        {error && <p className={styles.error}>{error}</p>}

        {mode === "up" && (
          <label className={styles.field}>
            <span>{t.name}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}

        <label className={styles.field}>
          <span>{t.email}</span>
          <input
            type="email"
            dir="ltr"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>{t.password}</span>
          <input
            type="password"
            dir="ltr"
            autoComplete={mode === "up" ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className={styles.primary} type="submit" disabled={busy}>
          {busy ? t.working : mode === "in" ? t.signIn : t.signUp}
        </button>
      </form>

      <p className={styles.divider}>{t.or}</p>

      <button
        className={styles.secondary}
        type="button"
        disabled={busy}
        onClick={google}
      >
        {t.google}
      </button>

      <button
        className={styles.linkBtn}
        type="button"
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setError("");
        }}
      >
        {mode === "in" ? t.noAccount : t.haveAccount}
      </button>
    </div>
  );
}
