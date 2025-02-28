// next.config.mjs

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@tanina/types'],
  // ...other valid configuration options...
};

export default nextConfig;
