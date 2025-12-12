'use cache';

import type { SignedUrlResponse } from '../models/api';

const BASE_URL = 'https://storage.imdat.dev';
const API_KEY = process.env.STORAGE_API_KEY;

/**
 * Fetches a signed media URL using Next.js fetch with caching
 * Uses Next.js Data Cache and Cache Components for optimal performance
 * @cacheLife - Cache for 1 hour (3600 seconds)
 */
export const fetchMedia = async (path: string): Promise<SignedUrlResponse> => {
  const url = new URL('/api/media/sign', BASE_URL);
  url.searchParams.set('file', path);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-API-Key': API_KEY || '',
    },
    // Next.js caching options
    next: {
      // Cache for 1 hour, revalidate on-demand
      revalidate: 3600,
      // Tag for cache invalidation
      tags: [`media:${path}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
  }

  const data: SignedUrlResponse = await response.json();

  if (!data.success) {
    throw new Error('Media fetch was not successful');
  }

  return data;
};
