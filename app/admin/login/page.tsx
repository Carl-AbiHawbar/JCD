import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";
import styles from "../admin.module.css";

export const metadata = { title: "تسجيل الدخول — لوحة التحكم" };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>لوحة التحكم</h1>
        <p className={styles.loginSub}>سجّل الدخول للمتابعة</p>
        <LoginForm />
      </div>
    </div>
  );
}
