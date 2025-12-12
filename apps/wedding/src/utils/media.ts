import 'server-only';

import type { Person } from '../models/common';

import { fetchMedia } from '../api';

/**
 * Fetches multiple media files in parallel and returns successful URLs
 */
export const fetchMediaUrls = async (paths: readonly string[]): Promise<string[]> => {
  const results = await Promise.allSettled(paths.map((path) => fetchMedia(path)));

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
 */
export const fetchMediaUrl = async (path: string): Promise<null | string> => {
  try {
    const result = await fetchMedia(path);
    return result.data?.url ?? null;
  } catch {
    return null;
  }
};

/**
 * Updates a person object with a fetched media URL
 */
export const updatePersonWithMedia = async (person: Person): Promise<Person> => {
  const url = await fetchMediaUrl(person.image.src);
  return { ...person, image: { ...person.image, src: url ?? person.image.src } };
};
