"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "jcdCart";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  quantity: number;
};

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  ready: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function isLine(value: unknown): value is CartLine {
  const l = value as CartLine;
  return (
    !!l &&
    typeof l.productId === "string" &&
    typeof l.slug === "string" &&
    typeof l.title === "string" &&
    Number.isFinite(l.priceCents) &&
    Number.isInteger(l.quantity) &&
    l.quantity > 0
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Restore once on the client so server and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setLines(parsed.filter(isLine));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — the cart just won't survive a reload */
    }
  }, [lines, ready]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      setLines((prev) => {
        const found = prev.find((l) => l.productId === line.productId);
        if (found) {
          return prev.map((l) =>
            l.productId === line.productId
              ? { ...l, quantity: Math.min(l.quantity + quantity, 99) }
              : l,
          );
        }
        return [...prev, { ...line, quantity }];
      });
    },
    [],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(quantity, 99) }
              : l,
          ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(
    () => ({
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotalCents: lines.reduce((n, l) => n + l.priceCents * l.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, ready, add, setQuantity, remove, clear],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}

export function formatPrice(cents: number, currency = "USD") {
  const amount = cents / 100;
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return currency === "USD" ? `$${text}` : `${text} ${currency}`;
}
