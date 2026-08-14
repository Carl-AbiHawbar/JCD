"use client";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "./client";

/**
 * Customer accounts, and the admin sign-in.
 *
 * The admin signs in with a username rather than an email. That username is
 * mapped to a fixed Firebase account here — the password itself is never in
 * this code and is never compared in the browser. Firebase verifies it, and
 * admin rights still come from a document in `admins`, which no client can
 * write. Checking a hard-coded password in client code would be no security at
 * all, since anyone can read the bundle.
 */

export const ADMIN_USERNAME = "JCDORG";
const ADMIN_EMAIL = "jcdorg@jcd-lebanon.org";

/** Lets the one admin identity be typed as a username instead of an email. */
export function resolveLoginIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  return trimmed.toUpperCase() === ADMIN_USERNAME ? ADMIN_EMAIL : trimmed;
}

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export async function signUpCustomer({ name, email, password }: SignUpInput) {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth(),
    email.trim(),
    password,
  );
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return credential.user;
}

export function displayNameOf(user: User | null) {
  if (!user) return "";
  return user.displayName || user.email?.split("@")[0] || "";
}

/** Turns a Firebase auth error code into wording a shopper can act on. */
export function authErrorMessage(cause: unknown, locale: "ar" | "en") {
  const code =
    typeof cause === "object" && cause !== null && "code" in cause
      ? String((cause as { code: unknown }).code)
      : "";

  const ar: Record<string, string> = {
    "auth/email-already-in-use": "هذا البريد الإلكتروني مسجّل بالفعل.",
    "auth/invalid-email": "البريد الإلكتروني غير صحيح.",
    "auth/weak-password": "كلمة المرور قصيرة جداً (6 أحرف على الأقل).",
    "auth/popup-closed-by-user": "تم إغلاق نافذة الدخول.",
  };
  const en: Record<string, string> = {
    "auth/email-already-in-use": "That email address is already registered.",
    "auth/invalid-email": "That email address is not valid.",
    "auth/weak-password": "That password is too short (6 characters minimum).",
    "auth/popup-closed-by-user": "The sign-in window was closed.",
  };

  const table = locale === "ar" ? ar : en;
  if (table[code]) return table[code];

  // Wrong password and unknown account are deliberately not distinguished,
  // so this cannot be used to discover which addresses exist.
  return locale === "ar"
    ? "بيانات الدخول غير صحيحة."
    : "Those sign-in details are not correct.";
}
