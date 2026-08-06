import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../admin.module.css";

async function saveSettings(formData: FormData) {
  "use server";
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("site_settings")
    .update({
      phone: String(formData.get("phone") ?? "").trim(),
      helpline_ar: String(formData.get("helpline_ar") ?? "").trim(),
      helpline_note_ar: String(formData.get("helpline_note_ar") ?? "").trim(),
    })
    .eq("id", true);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export default async function SettingsPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>إعدادات الموقع</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.cardPad}>
          <form className={styles.form} action={saveSettings}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="phone">
                رقم خط المساعدة
              </label>
              <input
                className={styles.input}
                id="phone"
                name="phone"
                dir="ltr"
                defaultValue={data?.phone ?? ""}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="helpline_ar">
                عنوان الشريط
              </label>
              <input
                className={styles.input}
                id="helpline_ar"
                name="helpline_ar"
                defaultValue={data?.helpline_ar ?? ""}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="helpline_note_ar">
                نص الشريط
              </label>
              <input
                className={styles.input}
                id="helpline_note_ar"
                name="helpline_note_ar"
                defaultValue={data?.helpline_note_ar ?? ""}
              />
            </div>

            <div className={styles.formActions}>
              <button className={styles.btnPrimary} type="submit">
                حفظ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
