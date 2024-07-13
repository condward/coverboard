import axios from 'axios';
import { z } from 'zod';

import { apiKeysAtom, store } from 'store';
import { CoverLabelValues, Media, mediaMap } from 'types';
import { isFulfilled } from 'utils';

export const BASE_URL = 'https://albumcoverboard.vercel.app';

const resultSchema = z.object({
  value: z.object({
    data: z.unknown(),
  }),
});

export const apiFetch = async (
  media: Media,
  coverArray: CoverLabelValues,
  secret?: string,
): Promise<Array<{ index: number; data: unknown }>> => {
  const { apiName } = mediaMap[media];

  if (!apiName) throw new Error('invalid call');

  const albums = await Promise.allSettled(
    coverArray.map(({ title, subtitle }) => {
      return axios.get(`${BASE_URL}${mediaMap[media].baseUrl}`, {
        params: {
          title,
          subtitle,
          secret: secret ?? store.get(apiKeysAtom)[apiName],
        },
      });
    }),
  );

  return albums.flatMap((result, index) =>
    isFulfilled(result)
      ? {
          index,
          data: resultSchema.parse(result).value.data,
        }
      : [],
  );
};
