import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "promptpay.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
