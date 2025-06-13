import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["local-ne.larashops.local"],
  images: {
    remotePatterns: [new URL("https://gw.alicdn.com/**")],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
