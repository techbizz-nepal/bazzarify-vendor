import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["local-ne.larashops.local"],
  images: {
    remotePatterns: [new URL("https://gw.alicdn.com/**")],
  },
};

export default nextConfig;
