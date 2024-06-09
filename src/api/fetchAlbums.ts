import { z } from 'zod';

import { CoverLabelValues, Media, SearchResults } from 'types';

import { apiFetch } from './base';

const lastFmApiSchema = z.object({
  album: z.object({
    artist: z.string(),
    name: z.string(),
    image: z.array(
      z.object({
        size: z.string(),
        '#text': z.string().url(),
      }),
    ),
  }),
});

export const getLastFMAlbums = async (
  bandArray: CoverLabelValues,
  secret?: string,
): Promise<SearchResults> => {
  const covers = await apiFetch(Media.MUSIC, bandArray, secret);

  return covers.flatMap(({ data, index }) => {
    const result = lastFmApiSchema.parse(data);

    return result.album.image[2]['#text']
      ? {
          link: result.album.image[2]['#text'],
          title: result.album.name,
          subtitle: result.album.artist,
          index,
        }
      : [];
  });
};
