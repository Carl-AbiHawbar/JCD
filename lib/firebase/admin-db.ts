"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./client";
import type {
  DiscountCode,
  Donation,
  Faq,
  Order,
  OrderItem,
  OrderStatus,
  OrderWithItems,
  Product,
  Program,
  SiteEvent,
  Subscriber,
  AssessmentRecord,
} from "./types";
import { orderTotals } from "./types";

/**
 * Dashboard reads and writes. Every call here runs as the signed-in admin and
 * is authorised by firestore.rules — nothing is privileged by virtue of living
 * in this file.
 */

import type { QuerySnapshot, DocumentData } from "firebase/firestore";

function rows<T>(snapshot: QuerySnapshot<DocumentData>): T[] {
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

/* ------------------------------------------------------------------ orders */

export async function listOrders(max = 200): Promise<OrderWithItems[]> {
  const snap = await getDocs(
    query(collection(db(), "orders"), orderBy("createdAt", "desc"), fsLimit(max)),
  );

  // Line items live in a subcollection so the rules can validate each price,
  // which means one read per order here. Fine at this volume.
  return Promise.all(
    snap.docs.map(async (d) => {
      const order = { id: d.id, ...d.data() } as Order;
      const itemsSnap = await getDocs(collection(d.ref, "items"));
      const items = rows<OrderItem>(itemsSnap);
      return { ...order, items, ...orderTotals(order, items) };
    }),
  );
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db(), "orders", id), { status });
}

/* ---------------------------------------------------------------- products */

export async function listProducts(): Promise<Product[]> {
  const snap = await getDocs(
    query(collection(db(), "products"), orderBy("sortOrder", "asc")),
  );
  return rows<Product>(snap);
}

export type ProductInput = Omit<Product, "id">;

export async function createProduct(input: ProductInput) {
  await addDoc(collection(db(), "products"), input);
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  await updateDoc(doc(db(), "products", id), input);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db(), "products", id));
}

/* ----------------------------------------------------------- discount codes */

export async function listDiscountCodes(): Promise<DiscountCode[]> {
  const snap = await getDocs(collection(db(), "discountCodes"));
  return rows<DiscountCode>(snap);
}

/** The code itself is the document id, so lookups at checkout are a single get. */
export async function saveDiscountCode(
  code: string,
  data: { percent: number; active: boolean; labelAr?: string },
) {
  const id = code.trim().toUpperCase();
  await setDoc(
    doc(db(), "discountCodes", id),
    { ...data, createdAt: serverTimestamp() },
    { merge: true },
  );
}

export async function deleteDiscountCode(id: string) {
  await deleteDoc(doc(db(), "discountCodes", id));
}

/* ---------------------------------------------------------------- content */

export async function listAll<T>(name: string, order = "sortOrder"): Promise<T[]> {
  const snap = await getDocs(query(collection(db(), name), orderBy(order, "asc")));
  return rows<T>(snap);
}

export async function createDoc(name: string, data: Record<string, unknown>) {
  await addDoc(collection(db(), name), data);
}

export async function updateDocById(
  name: string,
  id: string,
  data: Record<string, unknown>,
) {
  await updateDoc(doc(db(), name, id), data);
}

export async function deleteDocById(name: string, id: string) {
  await deleteDoc(doc(db(), name, id));
}

export type { Faq, Program, SiteEvent };

/* ------------------------------------------------------------- other lists */

export async function listDonations(): Promise<Donation[]> {
  const snap = await getDocs(
    query(collection(db(), "donations"), orderBy("createdAt", "desc"), fsLimit(200)),
  );
  return rows<Donation>(snap);
}

export async function listSubscribers(): Promise<Subscriber[]> {
  const snap = await getDocs(
    query(collection(db(), "subscribers"), orderBy("createdAt", "desc"), fsLimit(500)),
  );
  return rows<Subscriber>(snap);
}

export async function listAssessments(): Promise<AssessmentRecord[]> {
  const snap = await getDocs(
    query(collection(db(), "assessments"), orderBy("createdAt", "desc"), fsLimit(200)),
  );
  return rows<AssessmentRecord>(snap);
}

export async function countPublished(name: string) {
  const snap = await getDocs(
    query(collection(db(), name), where("status", "==", "published")),
  );
  return snap.size;
}
