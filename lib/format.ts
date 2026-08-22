import type { Locale } from "./i18n";

const ARABIC_INDIC = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Rewrites Western digits as Arabic-Indic ones (٠١٢…). */
export function toArabicDigits(value: string) {
  return value.replace(/[0-9]/g, (d) => ARABIC_INDIC[Number(d)]);
}

/**
 * A phone number as it should be *shown*.
 *
 * Arabic pages get Arabic-Indic digits; English pages keep Western ones. The
 * result is always meant to be rendered inside `dir="ltr"` — a phone number is
 * a left-to-right sequence, and without that the bidi algorithm reorders the
 * groups in an RTL page, turning "+961 1 234 567" into "567 234 1 961+".
 *
 * Never use this for a `tel:` link: dialling needs the Western digits.
 */
export function displayPhone(phone: string, locale: Locale) {
  return locale === "ar" ? toArabicDigits(phone) : phone;
}

/** The digits a `tel:` link needs, whatever the page language. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/**
 * A wa.me link, which opens the WhatsApp app when it is installed and the web
 * client otherwise. It takes the number in full international form with no
 * plus sign and no separators.
 */
export function whatsappHref(phone: string) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}`;
}
