import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    /** Prefer project lockfile when multiple exist under a parent folder (local dev). */
    root: path.join(process.cwd()),
  },
};

export default nextConfig;
