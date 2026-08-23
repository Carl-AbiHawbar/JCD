import { jcdPhone } from "./content";
import type { Locale } from "./i18n";

/**
 * Whish Money payment details.
 *
 * Whish publishes no URL scheme for constructing a payment on the fly — their
 * FAQ states that a payment link is created inside the Whish app by the
 * recipient and then shared. So the site cannot build a link like
 * `whish://pay?number=…&amount=…`; it can only send the payer to a link JCD
 * generated, or show JCD's Whish number for a manual transfer.
 *
 * Both fields start empty on purpose. A placeholder number here would send
 * real donations to whoever owns it, so the payment step shows the helpline
 * instead of guessing.
 */
export const whish = {
  /**
   * JCD's Whish Money number — the same mobile the site publishes. Should the
   * wallet ever sit on a different number from the helpline, replace this with
   * that number rather than changing `jcdPhone`.
   */
  number: jcdPhone,
  /** A payment link created in the Whish app (Whish Me / payment request). */
  paymentLink: "",
} as const;

/**
 * Is this a number a Whish wallet can actually sit on?
 *
 * Whish is a mobile wallet, so the receiver must be a Lebanese mobile: +961
 * then 3 + six digits, or 70/71/76/78/79/81 + six digits. Landline area codes
 * (1, 4, 5, 6, 8, 9) are rejected.
 *
 * This is deliberately fail-closed. A wrong receiver here does not produce an
 * error message — it sends a donor's money to a stranger, or nowhere. If the
 * configured number cannot be a wallet, the payment step shows the helpline
 * instead of quietly offering a bad destination.
 */
export function isWhishReceiver(number: string) {
  const digits = number.replace(/[^\d]/g, "");
  const national = digits.startsWith("961") ? digits.slice(3) : digits;

  if (/^3\d{6}$/.test(national)) return true;
  if (/^(70|71|76|78|79|81)\d{6}$/.test(national)) return true;
  return false;
}

export const whishNumberUsable = isWhishReceiver(whish.number);

/**
 * A payment link needs no validation — JCD generated it inside their own app,
 * so it already points at their wallet.
 */
export const whishConfigured = Boolean(whishNumberUsable || whish.paymentLink);

/**
 * A link that opens the Whish app.
 *
 * whish.money publishes an apple-app-site-association claiming the path
 * pattern `*pay/*`, and an assetlinks.json delegating whish.money to
 * money.whish.android, so a phone with Whish installed hands that URL to the
 * app. What it lacks is a working web fallback: without the app the same URL
 * redirects to whish.money/app/, which returns 404.
 *
 * So Android gets an intent URL, which launches the app by package name and
 * names its own fallback, and iOS gets the plain universal link because that
 * is the only form iOS will hand to an app. Anywhere else goes straight to the
 * download page. Nothing is pre-filled either way — Whish generates payment
 * links inside the app — which is what the copyable fields are for.
 */
export type Platform = "ios" | "android" | "other";

export const WHISH_DOWNLOAD = "https://whish.money/download";

export function whishOpenUrl(number: string, platform: Platform) {
  // Never build a transfer link to something that cannot be a wallet.
  if (!isWhishReceiver(number)) return "";
  const path = `whish.money/pay/${number.replace(/[^\d]/g, "")}`;

  if (platform === "android") {
    return (
      `intent://${path}#Intent;scheme=https;package=money.whish.android;` +
      `S.browser_fallback_url=${encodeURIComponent(WHISH_DOWNLOAD)};end`
    );
  }
  if (platform === "ios") return `https://${path}`;
  return WHISH_DOWNLOAD;
}

export const APP_STORE = "https://apps.apple.com/app/id1284243483";
export const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=money.whish.android";

export const paymentUi = {
  ar: {
    method: "طريقة الدفع",
    custom: "مبلغ آخر",
    customPlaceholder: "المبلغ بالدولار",
    tooSmall: "أقل مبلغ للتبرع هو $1.",
    copyAmount: "نسخ المبلغ",
    donor: "المتبرع",
    cod: "الدفع عند الاستلام",
    whish: "الدفع عبر Whish",
    payWithWhish: "ادفع عبر Whish",
    openWhish: "افتح تطبيق Whish",
    openHint: "يفتح تطبيق Whish إن كان مثبتاً، وإلا تفتح صفحة تحميل التطبيق.",
    amount: "المبلغ",
    reference: "الرقم المرجعي",
    numberLabel: "رقم Whish الخاص بالجمعية",
    receiverPhone: "رقم هاتف المستلم",
    amountUsd: "المبلغ بالدولار",
    noteField: "ملاحظة",
    copyField: "نسخ",
    copy: "نسخ الرقم",
    copied: "تم النسخ ✓",
    steps: "افتح تطبيق Whish ← Whish to Whish، وانسخ القيم التالية في الحقول الثلاثة.",
    notConfigured:
      "لم يتم تفعيل الدفع عبر Whish بعد. يرجى التواصل معنا لإتمام التبرع.",
    getApp: "تحميل التطبيق",
    done: "تم الدفع",
    thanksTitle: "شكراً لك",
    thanksNote: "سنؤكد استلام المبلغ ونتواصل معك.",
  },
  en: {
    method: "Payment method",
    custom: "Other amount",
    customPlaceholder: "Amount in USD",
    tooSmall: "The smallest donation is $1.",
    copyAmount: "Copy amount",
    donor: "Donor",
    cod: "Cash on delivery",
    whish: "Pay with Whish",
    payWithWhish: "Pay with Whish",
    openWhish: "Open the Whish app",
    openHint: "Opens the Whish app if it is installed, otherwise its download page.",
    amount: "Amount",
    reference: "Reference",
    numberLabel: "JCD's Whish number",
    receiverPhone: "Receiver's phone number",
    amountUsd: "Amount in USD",
    noteField: "Note",
    copyField: "Copy",
    copy: "Copy number",
    copied: "Copied ✓",
    steps: "Open the Whish app → Whish to Whish, and copy these into the three fields.",
    notConfigured:
      "Whish payments are not set up yet. Please contact us to complete your donation.",
    getApp: "Get the app",
    done: "I have paid",
    thanksTitle: "Thank you",
    thanksNote: "We will confirm the transfer and get in touch.",
  },
} as const;

export function paymentsFor(locale: Locale) {
  return paymentUi[locale];
}
