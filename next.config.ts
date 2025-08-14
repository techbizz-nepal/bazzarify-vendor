import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["local-ne.larashops.local", "local-ne.bazzarify.local"],
  images: {
    remotePatterns: [
      new URL("https://gw.alicdn.com/**"),
      new URL("http://local-ne.bazzarify.local:8081/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
