import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for Docker deployment, standard serverless bundle for Vercel
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL || process.env.BACKEND_API_URL;
    if (!backendUrl) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;


