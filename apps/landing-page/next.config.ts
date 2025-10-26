//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const { join } = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  // nx: {},
  // output: 'standalone',
  // outputFileTracingRoot: join(__dirname, '../../'),
};

module.exports = composePlugins()(nextConfig);
