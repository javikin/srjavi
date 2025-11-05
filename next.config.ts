import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'three'],
  },
  transpilePackages: ['three'],
};

export default nextConfig;
