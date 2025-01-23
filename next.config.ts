import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Set to true for permanent redirects (HTTP 308)
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Update this value in production
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;


