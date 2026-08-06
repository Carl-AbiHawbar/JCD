/**
 * Registry describing every admin-managed table. The generic list/form pages
 * under app/admin/[resource] read this, so adding a content type is a matter
 * of adding an entry here rather than writing three more pages.
 *
 * Products, orders, subscribers and settings have their own pages because
 * they need behaviour this shape cannot express.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "slug"
  | "number"
  | "status"
  | "datetime"
  | "image";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
};

export type ResourceConfig = {
  /** URL segment and Supabase table name. */
  table: string;
  labelAr: string;
  /** Column rendered as the row's title in the list view. */
  titleField: string;
  /** Columns shown as extra list-view cells. */
  listFields: { name: string; label: string }[];
  fields: Field[];
  /** Default ordering for the list view. */
  orderBy: { column: string; ascending: boolean };
};

const STATUS_FIELD: Field = {
  name: "status",
  label: "الحالة",
  type: "status",
  required: true,
};

const SORT_FIELD: Field = {
  name: "sort_order",
  label: "الترتيب",
  type: "number",
  help: "الأصغر يظهر أولاً",
};

export const RESOURCES: Record<string, ResourceConfig> = {
  programs: {
    table: "programs",
    labelAr: "البرامج",
    titleField: "title_ar",
    listFields: [
      { name: "status", label: "الحالة" },
      { name: "sort_order", label: "الترتيب" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title_ar", label: "العنوان", type: "text", required: true },
      { name: "slug", label: "المعرّف", type: "slug", required: true },
      { name: "summary_ar", label: "الملخص", type: "textarea" },
      { name: "body_ar", label: "المحتوى", type: "textarea" },
      { name: "image_path", label: "الصورة", type: "image" },
      STATUS_FIELD,
      SORT_FIELD,
    ],
  },

  events: {
    table: "events",
    labelAr: "الفعاليات",
    titleField: "title_ar",
    listFields: [
      { name: "starts_at", label: "التاريخ" },
      { name: "status", label: "الحالة" },
    ],
    orderBy: { column: "starts_at", ascending: false },
    fields: [
      { name: "title_ar", label: "العنوان", type: "text", required: true },
      { name: "slug", label: "المعرّف", type: "slug", required: true },
      { name: "summary_ar", label: "الملخص", type: "textarea" },
      { name: "image_path", label: "الصورة", type: "image" },
      { name: "location_ar", label: "المكان", type: "text" },
      { name: "starts_at", label: "يبدأ في", type: "datetime" },
      { name: "ends_at", label: "ينتهي في", type: "datetime" },
      STATUS_FIELD,
      SORT_FIELD,
    ],
  },

  faqs: {
    table: "faqs",
    labelAr: "الأسئلة الشائعة",
    titleField: "question_ar",
    listFields: [
      { name: "status", label: "الحالة" },
      { name: "sort_order", label: "الترتيب" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "question_ar", label: "السؤال", type: "text", required: true },
      { name: "answer_ar", label: "الجواب", type: "textarea", required: true },
      STATUS_FIELD,
      SORT_FIELD,
    ],
  },

  testimonials: {
    table: "testimonials",
    labelAr: "التقييمات",
    titleField: "author_ar",
    listFields: [
      { name: "role_ar", label: "الصفة" },
      { name: "status", label: "الحالة" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "author_ar", label: "الاسم", type: "text", required: true },
      { name: "role_ar", label: "الصفة", type: "text" },
      { name: "quote_ar", label: "النص", type: "textarea", required: true },
      STATUS_FIELD,
      SORT_FIELD,
    ],
  },

  collections: {
    table: "collections",
    labelAr: "التصنيفات",
    titleField: "title_ar",
    listFields: [{ name: "sort_order", label: "الترتيب" }],
    orderBy: { column: "sort_order", ascending: true },
    fields: [
      { name: "title_ar", label: "الاسم", type: "text", required: true },
      { name: "slug", label: "المعرّف", type: "slug", required: true },
      SORT_FIELD,
    ],
  },
};

export function getResource(name: string): ResourceConfig | null {
  return Object.prototype.hasOwnProperty.call(RESOURCES, name)
    ? RESOURCES[name]
    : null;
}

/** Sidebar entries, including the resources that have bespoke pages. */
export const NAV_SECTIONS = [
  {
    label: "المتجر",
    items: [
      { href: "/admin/products", label: "المنتجات" },
      { href: "/admin/orders", label: "الطلبات" },
      { href: "/admin/collections", label: "التصنيفات" },
    ],
  },
  {
    label: "التبرعات",
    items: [{ href: "/admin/donations", label: "التبرعات" }],
  },
  {
    label: "المحتوى",
    items: [
      { href: "/admin/programs", label: "البرامج" },
      { href: "/admin/events", label: "الفعاليات" },
      { href: "/admin/faqs", label: "الأسئلة الشائعة" },
      { href: "/admin/testimonials", label: "التقييمات" },
    ],
  },
  {
    label: "التطوع",
    items: [{ href: "/admin/assessments", label: "تقييمات الجهوزية" }],
  },
  {
    label: "الإعدادات",
    items: [
      { href: "/admin/subscribers", label: "المشتركون" },
      { href: "/admin/settings", label: "إعدادات الموقع" },
    ],
  },
] as const;
