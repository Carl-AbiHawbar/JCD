import Image from "next/image";

import { LOGOS, type Committee } from "@/lib/images";

/** A committee's logo, standing in for its name in a heading. */
export default function CommitteeLogo({ committee }: { committee: Committee }) {
  const logo = LOGOS[committee];
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      sizes="320px"
    />
  );
}
