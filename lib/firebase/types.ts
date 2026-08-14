/** Document shapes stored in Firestore. Shared by the browser and the server. */

export type Status = "draft" | "published";

export type Product = {
  id: string;
  slug: string;
  titleAr: string;
  descriptionAr?: string;
  priceCents: number;
  currency: string;
  stock: number;
  status: Status;
  sortOrder: number;
  /** Public URL — either a Storage download URL or a path under /public. */
  image?: string | null;
};

export type Program = {
  id: string;
  slug: string;
  titleAr: string;
  summaryAr?: string;
  bodyAr?: string;
  image?: string | null;
  status: Status;
  sortOrder: number;
};

export type SiteEvent = {
  id: string;
  slug: string;
  titleAr: string;
  summaryAr?: string;
  image?: string | null;
  locationAr?: string;
  startsAt?: string;
  status: Status;
  sortOrder: number;
};

export type Faq = {
  id: string;
  questionAr: string;
  answerAr: string;
  status: Status;
  sortOrder: number;
};

export type Testimonial = {
  id: string;
  authorAr: string;
  roleAr?: string;
  quoteAr: string;
  status: Status;
  sortOrder: number;
};

export type DiscountCode = {
  id: string;
  /** Whole percent off, 1–100. */
  percent: number;
  active: boolean;
  labelAr?: string;
  createdAt?: string;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

export type Order = {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressAr?: string;
  note?: string;
  status: OrderStatus;
  /** Cash on delivery is the only method; nothing is charged online. */
  paymentMethod: "cod";
  currency: string;
  discountCode?: string;
  discountPercent?: number;
  /** Present when the shopper was signed in; guests order without one. */
  userId?: string;
  createdAt?: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  titleAr: string;
  unitPriceCents: number;
  quantity: number;
};

export type Donation = {
  id: string;
  amountCents: number;
  currency: string;
  status: "pledged" | "received" | "cancelled";
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  note?: string;
  createdAt?: string;
};

export type Subscriber = {
  id: string;
  email: string;
  unsubscribed?: boolean;
  createdAt?: string;
};

export type AssessmentRecord = {
  id: string;
  reference: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  statusAr: string;
  preferredTrack: string;
  answers: unknown[];
  strengths: string[];
  development: string[];
  reviewed?: boolean;
  createdAt?: string;
};

/** An order with its validated line items, as the dashboard shows it. */
export type OrderWithItems = Order & {
  items: OrderItem[];
  /**
   * Summed from the line items rather than stored: the rules validate each
   * item's price against the catalogue, but nothing could validate a total.
   */
  subtotalCents: number;
  totalCents: number;
};

export function orderTotals(
  order: Order,
  items: OrderItem[],
): { subtotalCents: number; totalCents: number } {
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const percent = order.discountPercent ?? 0;
  const totalCents = Math.round(subtotalCents * (1 - percent / 100));
  return { subtotalCents, totalCents };
}
