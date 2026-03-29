import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly enforce no trailing slashes for SEO
  trailingSlash: false,
  poweredByHeader: false,
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
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
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
