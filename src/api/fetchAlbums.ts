import axios from 'axios';
import { z } from 'zod';

import { ApiKeys, CoverLabelValues, SearchResults } from 'types';
import { apiKeysAtom, store } from 'store';
import { isFulfilled } from 'utils';

import { BASE_URL } from './base';

const lastFmApiSchema = z.object({
  data: z.object({
    album: z.object({
      artist: z.string(),
      mbid: z.string(),
      playcount: z.string(),
      url: z.string().url(),
      name: z.string(),
      listeners: z.string(),
      tags: z
        .object({
          tag: z.array(
            z.object({
              url: z.string().url(),
              name: z.string(),
            }),
          ),
        })
        .or(z.literal('')),
      image: z.array(
        z.object({
          size: z.string(),
          '#text': z.string().url(),
        }),
      ),
      tracks: z.object({
        track: z.array(
          z.object({
            streamable: z.object({
              fulltrack: z.string(),
              '#text': z.string(),
            }),
            duration: z.number().nullable(),
            url: z.string().url(),
            name: z.string(),
            '@attr': z.object({ rank: z.number() }),
            artist: z.object({
              url: z.string().url(),
              name: z.string(),
              mbid: z.string(),
            }),
          }),
        ),
      }),
      wiki: z
        .object({
          published: z.string(),
          summary: z.string(),
          content: z.string(),
        })
        .optional(),
    }),
  }),
});

export const getLastFMAlbums = async (
  bandArray: CoverLabelValues,
  apiKey?: string,
): Promise<SearchResults> => {
  const albums = await Promise.allSettled(
    bandArray.map((band) => {
      return axios.get(`${BASE_URL}/api/get-album`, {
        params: {
          album: band.title.trim(),
          artist: band.subtitle.trim(),
          secret: apiKey ?? store.get(apiKeysAtom)[ApiKeys.LAST_FM],
        },
      });
    }),
  );

  return albums.flatMap((result, index) => {
    if (isFulfilled(result)) {
      const { data } = lastFmApiSchema.parse(result.value);
      if (data.album.image[2]['#text']) {
        return {
          link: data.album.image[2]['#text'],
          title: data.album.name,
          subtitle: data.album.artist,
          index,
        };
      }
    }
    return [];
  });
};
