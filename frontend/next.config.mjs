import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Remove viewport configuration from here as it belongs in layout.tsx
})({
  // Remove nested pwa configuration
  // Add other Next.js configurations here
  reactStrictMode: true,
  experimental: {
    turbo: true
  }
});

export default config;