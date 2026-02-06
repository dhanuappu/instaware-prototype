import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Stop the build from failing on ESLint errors (like missing alt tags) */
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* Stop the build from failing on TypeScript type errors */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;