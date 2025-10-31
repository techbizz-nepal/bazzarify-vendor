import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "larashops.local",
    "bazzarify.local",
    "*.larashops.local",
    "admin.larashops.local",
  ],
  images: {
    remotePatterns: [
      new URL("https://gw.alicdn.com/**"),
      new URL("http://local-ne.bazzarify.local:8081/**"),
      new URL("http://local-ne.larashops.local:8081/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
