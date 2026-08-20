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
  /** JCD's Whish Money number. */
  number: "+961 1 234 567",
  /** A payment link created in the Whish app (Whish Me / payment request). */
  paymentLink: "",
} as const;

export const whishConfigured = Boolean(whish.number || whish.paymentLink);

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
    openWhish: "فتح تطبيق Whish",
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
