'use cache';

import 'server-only';

import { cache } from 'react';

import type { Person } from '../models/common';

import { fetchMedia } from '../api';

/**
 * Cached version of fetchMedia to prevent duplicate requests during render
 * Uses React cache() for request deduplication within the same render pass
 * Uses 'use cache' directive for Cache Components support
 */
const cachedFetchMedia = cache(fetchMedia);

/**
 * Fetches multiple media files in parallel and returns successful URLs
 * Leverages Next.js Data Cache through fetchMedia's caching configuration
 */
export const fetchMediaUrls = async (paths: readonly string[]): Promise<string[]> => {
  const results = await Promise.allSettled(paths.map((path) => cachedFetchMedia(path)));

  return results
    .filter(
      (result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchMedia>>> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value.data?.url)
    .filter(Boolean) as string[];
};

/**
 * Fetches a single media file and returns the URL if successful
 * Uses cached fetchMedia for request deduplication and Next.js Data Cache
 */
export const fetchMediaUrl = async (path: string): Promise<null | string> => {
  try {
    const result = await cachedFetchMedia(path);
    return result.data?.url ?? null;
  } catch {
    return null;
  }
};

/**
 * Updates a person object with a fetched media URL
 * Leverages Next.js caching through fetchMediaUrl
 */
export const updatePersonWithMedia = async (person: Person): Promise<Person> => {
  const url = await fetchMediaUrl(person.image.src);
  return { ...person, image: { ...person.image, src: url ?? person.image.src } };
};
