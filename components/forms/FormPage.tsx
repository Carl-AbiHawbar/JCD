import CommitteeLogo from "@/components/CommitteeLogo";
import { Crumbs, PageShell } from "@/components/page/InnerPageView";
import type { FormId } from "@/lib/forms";
import { formSchema } from "@/lib/forms";
import type { Locale } from "@/lib/i18n";
import type { Committee } from "@/lib/images";
import type { Action } from "@/lib/pages";
import VolunteerForm from "./VolunteerForm";
import styles from "./forms.module.css";

/** The readiness form is how young people join a JCD Club. */
const COMMITTEE: Record<FormId, Committee> = { jcd: "club", mcd: "mcd" };

/** A volunteer form on its own page, under the site header. */
export default function FormPage({
  id,
  locale,
  trail,
}: {
  id: FormId;
  locale: Locale;
  trail: Action[];
}) {
  const schema = formSchema(id, locale);
  const committee = COMMITTEE[id];

  return (
    <PageShell locale={locale} committee={committee}>
      <div className={styles.page}>
        <div className={styles.inner}>
          <Crumbs trail={trail} />
          <header className={styles.intro}>
            <div className={styles.logo}>
              <CommitteeLogo committee={committee} />
            </div>
            <p className={styles.eyebrow}>{schema.eyebrow}</p>
            <h1 className={styles.title}>{schema.title}</h1>
            <p className={styles.lead}>{schema.intro}</p>
          </header>
          <VolunteerForm schema={schema} locale={locale} />
        </div>
      </div>
    </PageShell>
  );
}
