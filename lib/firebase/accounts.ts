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
