import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('storage.googleapis.com')],
  },
};

export default nextConfig;
