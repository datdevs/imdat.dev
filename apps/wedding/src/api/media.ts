import type { components } from '../models/openapi/schema';

import { apiClient } from './apiClient';

export const fetchMedia = async (path: string): Promise<components['schemas']['SignedUrlResponse']> => {
  const { data, error } = await apiClient.GET('/api/media/sign', {
    params: {
      query: {
        file: path,
      },
    },
  });

  if (error || !data.success) {
    throw error;
  }

  return data;
};
