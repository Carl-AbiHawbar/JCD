import type { Metadata } from "next";

import Assessment from "@/components/assessment/Assessment";

export const metadata: Metadata = {
  title: "تقييم جهوزية التطوع",
  description: "تقييم أولي لجهوزية المتطوعين",
};

export default function VolunteerReadinessPage() {
  return <Assessment />;
}
