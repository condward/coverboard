import axios from 'axios';
import { z } from 'zod';

import { ApiKeys, CoverLabelValues, SearchResults } from 'types';
import { apiKeysAtom, store } from 'store';
import { isFulfilled } from 'utils';

import { BASE_URL } from './base';

const rawgApiSchema = z.object({
  data: z.array(
    z.object({
      added: z.number(),
      added_by_status: z
        .object({
          beaten: z.number().optional(),
          dropped: z.number().optional(),
          owned: z.number().optional(),
          playing: z.number().optional(),
          toplay: z.number().optional(),
          yet: z.number().optional(),
        })
        .nullable(),
      background_image: z.string().url().nullable(),
      dominant_color: z.string(),
      esrb_rating: z
        .object({
          id: z.number(),
          name: z.string(),
          name_en: z.string(),
          name_ru: z.string(),
          slug: z.string(),
        })
        .nullable(),
      genres: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          slug: z.string(),
        }),
      ),
      id: z.number(),
      metacritic: z.number().nullable(),
      name: z.string(),
      parent_platforms: z.array(
        z.object({
          platform: z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
          }),
        }),
      ),
      platforms: z.array(
        z.object({
          platform: z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
          }),
        }),
      ),
      playtime: z.number(),
      rating: z.number(),
      rating_top: z.number(),
      ratings: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          count: z.number(),
          percent: z.number(),
        }),
      ),
      ratings_count: z.number(),
      released: z.string().nullable(),
      reviews_count: z.number(),
      reviews_text_count: z.number(),
      saturated_color: z.string(),
      score: z.string(),
      short_screenshots: z.array(
        z.object({
          id: z.number(),
          image: z.string().url(),
        }),
      ),
      slug: z.string(),
      stores: z
        .array(
          z.object({
            store: z.object({
              id: z.number(),
              name: z.string(),
              slug: z.string(),
            }),
          }),
        )
        .nullable(),
      suggestions_count: z.number(),
      tags: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          slug: z.string(),
          language: z.string(),
          image_background: z.string().url().nullable(),
          games_count: z.number(),
        }),
      ),
      tba: z.boolean(),
      updated: z.string(),
    }),
  ),
});

// Function to get the poster image of a movie
export const getGames = async (
  movieTitles: CoverLabelValues,
  apiKey?: string,
): Promise<SearchResults> => {
  const games = await Promise.allSettled(
    movieTitles.map((game) => {
      return axios.get(`${BASE_URL}/api/get-game`, {
        params: {
          game: game.title,
          ...(game.subtitle && { year: game.subtitle }),
          secret: apiKey ?? store.get(apiKeysAtom)[ApiKeys.RAWG],
        },
      });
    }),
  );

  return games.flatMap((result, index) => {
    if (isFulfilled(result)) {
      const { data } = rawgApiSchema.parse(result.value);
      if (data.length > 0 && data[0].background_image) {
        const link = data[0].background_image;
        return {
          link,
          title: data[0].name,
          subtitle: data[0].released?.slice(0, 4) ?? '',
          index,
        };
      }
    }
    return [];
  });
};
