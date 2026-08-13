"use client";

import { useState } from "react";

import { useAuth } from "@/lib/firebase/auth";
import styles from "./admin.module.css";

export default function LoginForm({
  signedInButNotAdmin,
}: {
  signedInButNotAdmin: boolean;
}) {
  const { signInWithPassword, signInWithGoogle, signOut, user } = useAuth();
  // Accepts either the admin username or an email address; see
  // resolveLoginIdentifier in lib/firebase/accounts.ts.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch {
      // Firebase distinguishes wrong-password from unknown-user; collapsing
      // them avoids telling an attacker which addresses exist.
      setError("بيانات الدخول غير صحيحة.");
    } finally {
      setBusy(false);
    }
  }

  if (signedInButNotAdmin) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>لا تملك صلاحية الدخول</h1>
          <p className={styles.loginNote}>
            الحساب <strong dir="ltr">{user?.email}</strong> ليس ضمن المشرفين.
            يجب إضافة مستند في مجموعة <code dir="ltr">admins</code> بمعرّف
            المستخدم التالي:
          </p>
          <p className={styles.error} dir="ltr">
            {user?.uid}
          </p>
          <div className={styles.formActions} style={{ marginTop: 16 }}>
            <button className={styles.btn} type="button" onClick={signOut}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>تسجيل الدخول</h1>
        <p className={styles.loginNote}>لوحة تحكم موقع JCD</p>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            run(() => signInWithPassword(email, password));
          }}
        >
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="email">
              اسم المستخدم
            </label>
            <input
              className={styles.input}
              id="email"
              type="text"
              autoComplete="username"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="password">
              كلمة المرور
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              autoComplete="current-password"
              dir="ltr"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.formActions}>
            <button className={styles.btnPrimary} type="submit" disabled={busy}>
              {busy ? "جارٍ الدخول…" : "تسجيل الدخول"}
            </button>
          </div>
        </form>

        <p className={styles.divider}>أو</p>

        <button
          className={styles.btn}
          type="button"
          disabled={busy}
          onClick={() => run(signInWithGoogle)}
          style={{ width: "100%", justifyContent: "center" }}
        >
          المتابعة عبر Google
        </button>
      </div>
    </div>
  );
}
