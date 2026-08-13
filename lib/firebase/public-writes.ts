"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "./client";
import type { CartLine } from "../cart";
import type { DiscountCode } from "./types";

/**
 * Everything a visitor is allowed to write.
 *
 * There is no trusted server in this stack, so each of these mirrors a rule in
 * firestore.rules — the rules are what actually enforce them. In particular an
 * order stores no total: the line items are written as separate documents so
 * the rules can check each unit price against the catalogue, and totals are
 * summed from those items wherever they are shown.
 */

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newReference() {
  const bytes = new Uint32Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => REF_ALPHABET[n % REF_ALPHABET.length]).join("");
}

/** Firestore rules allow `get` on a code but not `list`, so it cannot be enumerated. */
export async function lookupDiscount(code: string): Promise<DiscountCode | null> {
  const clean = code.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,24}$/.test(clean)) return null;

  try {
    const snap = await getDoc(doc(db(), "discountCodes", clean));
    if (!snap.exists()) return null;
    const data = snap.data() as Omit<DiscountCode, "id">;
    if (!data.active) return null;
    return { id: snap.id, ...data };
  } catch {
    return null;
  }
}

export type PlaceOrderInput = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
  lines: CartLine[];
  discount?: DiscountCode | null;
};

/**
 * Writes the order and its items in one batch, so an order can never be left
 * without the lines that give it a total.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<string> {
  if (input.lines.length === 0) throw new Error("EMPTY_CART");

  const reference = newReference();
  const batch = writeBatch(db());
  const orderRef = doc(collection(db(), "orders"));

  batch.set(orderRef, {
    reference,
    customerName: input.name.trim(),
    customerPhone: input.phone.trim(),
    ...(input.email?.trim() ? { customerEmail: input.email.trim() } : {}),
    ...(input.address?.trim() ? { addressAr: input.address.trim() } : {}),
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    ...(input.discount
      ? { discountCode: input.discount.id, discountPercent: input.discount.percent }
      : {}),
    status: "pending",
    paymentMethod: "cod",
    currency: "USD",
    createdAt: serverTimestamp(),
  });

  for (const line of input.lines) {
    batch.set(doc(collection(orderRef, "items")), {
      productId: line.productId,
      titleAr: line.title,
      unitPriceCents: line.priceCents,
      quantity: line.quantity,
    });
  }

  await batch.commit();
  return reference;
}

export async function subscribe(email: string) {
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) || clean.length > 254) {
    throw new Error("INVALID_EMAIL");
  }
  await addDoc(collection(db(), "subscribers"), {
    email: clean,
    createdAt: serverTimestamp(),
  });
}

export async function pledgeDonation(input: {
  amountCents: number;
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
}) {
  await addDoc(collection(db(), "donations"), {
    amountCents: input.amountCents,
    currency: "USD",
    status: "pledged",
    ...(input.name?.trim() ? { donorName: input.name.trim() } : {}),
    ...(input.email?.trim() ? { donorEmail: input.email.trim() } : {}),
    ...(input.phone?.trim() ? { donorPhone: input.phone.trim() } : {}),
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function submitAssessment(payload: Record<string, unknown>) {
  await addDoc(collection(db(), "assessments"), {
    ...payload,
    reviewed: false,
    createdAt: serverTimestamp(),
  });
}
