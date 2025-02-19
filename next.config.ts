import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "med.uem.mz",
        pathname: "/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;
