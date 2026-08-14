"use client";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { db } from "./client";
import type { Order, OrderItem, OrderWithItems } from "./types";
import { orderTotals } from "./types";

/**
 * A shopper's own order history.
 *
 * The query filters on `userId` because that is exactly what the security
 * rules permit: a signed-in shopper may read orders carrying their own uid and
 * nothing else. Guest orders have no uid and stay admin-only.
 */
export async function listMyOrders(uid: string): Promise<OrderWithItems[]> {
  const snap = await getDocs(
    query(
      collection(db(), "orders"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc"),
    ),
  );

  return Promise.all(
    snap.docs.map(async (d) => {
      const order = { id: d.id, ...d.data() } as Order;
      const itemsSnap = await getDocs(collection(d.ref, "items"));
      const items = itemsSnap.docs.map(
        (i) => ({ id: i.id, ...i.data() }) as OrderItem,
      );
      return { ...order, items, ...orderTotals(order, items) };
    }),
  );
}
