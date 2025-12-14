// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const { composePlugins } = require('@nx/next');
const { join } = require('node:path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  cacheComponents: true,
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
};

module.exports = composePlugins()(nextConfig);
