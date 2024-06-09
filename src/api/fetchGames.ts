import { z } from 'zod';

import { CoverLabelValues, Media, SearchResults } from 'types';

import { apiFetch } from './base';

const rawgApiSchema = z.array(
  z.object({
    background_image: z.string().url().nullable(),
    name: z.string(),
    released: z.string().nullable(),
  }),
);

export const getGames = async (
  coverArray: CoverLabelValues,
  secret?: string,
): Promise<SearchResults> => {
  const covers = await apiFetch(Media.GAME, coverArray, secret);

  return covers.flatMap(({ data, index }) => {
    const result = rawgApiSchema.parse(data);

    return result.length > 0 && result[0].background_image
      ? {
          link: result[0].background_image,
          title: result[0].name,
          subtitle: result[0].released?.slice(0, 4) ?? '',
          index,
        }
      : [];
  });
};
