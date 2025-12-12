// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const { composePlugins } = require('@nx/next');
const { join } = require('node:path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'storage.imdat.dev',
        protocol: 'https',
      },
    ],
  },
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  // nx: {},
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  poweredByHeader: false,
  reactStrictMode: true,
  // Cache Components: Enable for advanced caching with 'use cache' directive
  // This is optional and provides fine-grained cache control
  // See: https://nextjs.org/docs/app/api-reference/next-config-js/cacheComponents
  experimental: {
    cacheComponents: true,
  },
};

module.exports = composePlugins()(nextConfig);
