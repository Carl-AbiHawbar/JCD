/** Hand-written mirror of supabase/migrations/0001_init.sql. */

export type ContentStatus = "draft" | "published";
export type ProductStatus = ContentStatus | "archived";
export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type Collection = {
  id: string;
  slug: string;
  title_ar: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_ar: string | null;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string | null;
  price_cents: number;
  currency: string;
  stock: number;
  status: ProductStatus;
  collection_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  title_ar: string;
  unit_price_cents: number;
  quantity: number;
};

export type Order = {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  address_ar: string | null;
  status: OrderStatus;
  subtotal_cents: number;
  currency: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type Program = {
  id: string;
  slug: string;
  title_ar: string;
  summary_ar: string | null;
  body_ar: string | null;
  image_path: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteEvent = {
  id: string;
  slug: string;
  title_ar: string;
  summary_ar: string | null;
  image_path: string | null;
  location_ar: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: string;
  question_ar: string;
  answer_ar: string;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  author_ar: string;
  role_ar: string | null;
  quote_ar: string;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  unsubscribed: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: boolean;
  phone: string;
  helpline_ar: string;
  helpline_note_ar: string;
  updated_at: string;
};

export type Donation = {
  id: string;
  reference: string;
  amount_cents: number;
  currency: string;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  note: string | null;
  status: "pledged" | "received" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type AssessmentRecord = {
  id: string;
  reference: string;
  score: number;
  max_score: number;
  percentage: number;
  level: "blocked" | "high" | "good" | "developing" | "limited";
  status_ar: string;
  preferred_track: string;
  answers: {
    questionId: string;
    question: string;
    answerValue: string | null;
    answer: string | null;
    score: number | null;
  }[];
  strengths: string[];
  development: string[];
  reviewed: boolean;
  created_at: string;
};

export type Admin = {
  user_id: string;
  email: string;
  role: "owner" | "staff";
  created_at: string;
};

/** Shape postgrest-js expects for each table; `Relationships` is required. */
type Row<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admins: Row<Admin>;
      collections: Row<Collection>;
      products: Row<Product>;
      product_images: Row<ProductImage>;
      orders: Row<Order>;
      order_items: Row<OrderItem>;
      programs: Row<Program>;
      events: Row<SiteEvent>;
      faqs: Row<Faq>;
      testimonials: Row<Testimonial>;
      subscribers: Row<Subscriber>;
      site_settings: Row<SiteSettings>;
      assessments: Row<AssessmentRecord>;
      donations: Row<Donation>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      create_order: {
        Args: {
          p_name: string;
          p_phone: string;
          p_email: string;
          p_address: string;
          p_note: string;
          p_items: { productId: string; quantity: number }[];
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
