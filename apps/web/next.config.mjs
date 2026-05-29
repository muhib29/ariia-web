/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['ariiaai-strapi-cms.s3.us-east-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eleven-public-cdn.elevenlabs.io',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@workspace/ui',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      const splitChunks = config.optimization.splitChunks ?? {};
      config.optimization.splitChunks = {
        ...splitChunks,
        cacheGroups: {
          ...splitChunks.cacheGroups,
        },
      };
    }
    return config;
  },
  async headers() {
    const immutableOneYear = {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    };
    const optimizedImageCache = {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, stale-while-revalidate=86400',
    };

    return [
      {
        source: '/_next/static/:path*',
        headers: [immutableOneYear],
      },
      {
        source: '/_next/image',
        headers: [optimizedImageCache],
      },
      {
        source: '/_next/image/:path*',
        headers: [optimizedImageCache],
      },
      {
        source: '/images/:path*',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.svg',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.png',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.webp',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.avif',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.jpg',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.jpeg',
        headers: [immutableOneYear],
      },
      {
        source: '/:path*.woff2',
        headers: [immutableOneYear],
      },
    ];
  },
};

export default nextConfig;
