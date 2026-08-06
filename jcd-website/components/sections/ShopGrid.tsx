"use client";

import { useState } from "react";

import { formatPrice, useCart } from "@/lib/cart";
import { HeartIcon } from "./icons";
import styles from "./sections.module.css";

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
};

export default function ShopGrid({
  products,
  addToCart,
}: {
  products: ShopProduct[];
  addToCart: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const [wished, setWished] = useState<Set<string>>(new Set());

  function onAdd(product: ShopProduct) {
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
    });
    setAdded(product.id);
    window.setTimeout(
      () => setAdded((cur) => (cur === product.id ? null : cur)),
      1400,
    );
  }

  function toggleWish(id: string) {
    setWished((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.products}>
      {products.map((product) => (
        <article className={styles.product} key={product.id}>
          <button
            className={wished.has(product.id) ? styles.wishOn : styles.wish}
            type="button"
            aria-pressed={wished.has(product.id)}
            aria-label={`أضف ${product.title} إلى المفضلة`}
            onClick={() => toggleWish(product.id)}
          >
            <HeartIcon />
          </button>

          <div className={styles.productMedia} />

          <div className={styles.productBody}>
            <h3 className={styles.productTitle}>{product.title}</h3>
            <p className={styles.productPrice} dir="ltr">
              {formatPrice(product.priceCents, product.currency)}
            </p>
            <button
              className={styles.addToCart}
              type="button"
              onClick={() => onAdd(product)}
            >
              {added === product.id ? "تمت الإضافة ✓" : addToCart}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
