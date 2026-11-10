/*
 * Phone numbers are always shown in Western digits, Arabic pages included —
 * JCD asked for that explicitly, since it is how the numbers are dialled and
 * printed everywhere else. Render them inside `dir="ltr"`: a phone number is a
 * left-to-right sequence, and without that the bidi algorithm reorders the
 * groups in an RTL page, turning "+961 70 277 877" into "877 277 70 961+".
 */

/** The digits a `tel:` link needs. */
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
