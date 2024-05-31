import { useMutation } from '@tanstack/react-query';

import { getLastFMAlbums, getMoviePosters, getGames } from 'api';
import { ApiKeys } from 'types';

export const useCheckApiKey = (apiName: ApiKeys) => {
  return useMutation({
    mutationFn: async (apiKey: string) => {
      if (apiName === ApiKeys.LAST_FM) {
        return await getLastFMAlbums(
          [{ title: 'Toxicity', subtitle: 'System of a Down' }],
          apiKey,
        );
      } else if (apiName === ApiKeys.RAWG) {
        return await getMoviePosters(
          [{ title: 'Alien', subtitle: '' }],
          apiKey,
        );
      } else {
        return await getGames([{ title: 'Tomb Raider', subtitle: '' }], apiKey);
      }
    },
    onSuccess(res) {
      if (res.length === 0) {
        throw new Error('Empty response');
      }
    },
  });
};
