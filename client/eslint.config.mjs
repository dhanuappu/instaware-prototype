import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* This allows the build to succeed even if there are linting errors */
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* This allows the build to succeed even if there are type errors */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;