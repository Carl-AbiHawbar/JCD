"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signIn, type ActionState } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.btnPrimary} type="submit" disabled={pending}>
      {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signIn,
    undefined,
  );

  return (
    <form className={styles.form} action={formAction}>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          dir="ltr"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="password">
          كلمة المرور
        </label>
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          required
        />
      </div>

      <div className={styles.formActions}>
        <SubmitButton />
      </div>
    </form>
  );
}
