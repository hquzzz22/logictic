import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard needed for blog images from Cloudflare R2
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Don't re-optimize external images already served by CDNs
    unoptimized: false,
  },
};

export default withNextIntl(nextConfig);
