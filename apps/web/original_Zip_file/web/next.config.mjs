/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Removed 'standalone' output mode - not compatible with AWS Amplify
  // AWS Amplify requires standard Next.js build output structure
  images: {
    domains: ['ariiaai-strapi-cms.s3.us-east-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eleven-public-cdn.elevenlabs.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
