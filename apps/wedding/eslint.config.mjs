import nx from '@nx/eslint-plugin';
import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

import baseConfig from '../../eslint.config.mjs';

export default defineConfig([
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  ...nx.configs['flat/react-typescript'],
  {
    ignores: ['.next/**/*'],
  },
]);
