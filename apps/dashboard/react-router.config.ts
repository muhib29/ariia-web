import type { Config } from '@react-router/dev/config';

export default {
  // Config options...
  // Disable SSR for static hosting (Vercel, Netlify, etc.)
  // Set to `true` if deploying to a Node.js server (Railway, Fly.io, etc.)
  ssr: false,
} satisfies Config;
