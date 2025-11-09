import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimized Docker builds
  output: "standalone",

  // Skip linting and type checking during build (for Docker)
  // Run these checks in CI/CD pipeline instead
  eslint: {
    // Linting is enabled during builds to catch issues early
  },
  typescript: {
    // Type checking is enforced during builds for safety
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
