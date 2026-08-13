import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The section artwork is SVG. next/image refuses SVG by default because a
    // remote one can carry scripts; these are local files in public/ that this
    // repository generates, and the CSP below neutralises scripting anyway.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
