import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'three'],
  },
  transpilePackages: ['three'],
};

export default withNextIntl(nextConfig);
