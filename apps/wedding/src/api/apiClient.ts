import createClient from 'openapi-fetch';

import type { paths } from '../models/openapi/schema';

export const apiClient = createClient<paths>({
  baseUrl: 'https://storage.imdat.dev',
  headers: {
    'X-API-Key': process.env.STORAGE_API_KEY,
  },
});

export const apiClientBrowser = createClient<paths>({
  baseUrl: '/api',
});
