import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "*" // Allow all hostnames for remote images
      },                                  
    ],
  },
};


export default nextConfig;
