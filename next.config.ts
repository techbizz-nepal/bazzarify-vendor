import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["local-ne.larashops.local"],
};

export default nextConfig;
