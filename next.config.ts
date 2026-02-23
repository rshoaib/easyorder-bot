import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/manifest.webmanifest',
        destination: '/manifest.json',
        permanent: true,
      },
      {
        source: '/month',
        destination: '/',
        permanent: true,
      },
    ];
  },

};

export default nextConfig;
