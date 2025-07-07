/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Netlify deployment configuration
  trailingSlash: true,
  output: process.env.NODE_ENV === 'production' && process.env.NETLIFY ? 'export' : 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NETLIFY ? '/.netlify/functions' : 'http://localhost:3001'),
  },

  // API rewrites for development
  async rewrites() {
    if (process.env.NETLIFY) {
      // In Netlify, use functions directly
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Image domains for optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: process.env.NETLIFY ? true : false, // Disable optimization for static export
  },

  // Experimental features
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;