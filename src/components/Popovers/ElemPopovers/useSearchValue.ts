import { useMutation } from '@tanstack/react-query';

import {
  getLastFMAlbums,
  getMoviePosters,
  getBookCovers,
  getGames,
  getTvShowPosters,
} from 'api';

import { useMainStore } from 'store';
import { CoverSchema, Media, SearchSchema } from 'types';

export const useSearchValue = (id: CoverSchema['id']) => {
  const media = useMainStore((state) => state.configs.media);
  const updateCover = useMainStore((state) => state.updateCover);

  return useMutation({
    mutationFn: async (inputArray: SearchSchema['search']) => {
      if (media === Media.MUSIC) {
        return await getLastFMAlbums(inputArray);
      } else if (media === Media.MOVIE) {
        return await getMoviePosters(inputArray);
      } else if (media === Media.BOOK) {
        return await getBookCovers(inputArray);
      } else if (media === Media.GAME) {
        return await getGames(inputArray);
      } else {
        return await getTvShowPosters(inputArray);
      }
    },
    onSuccess(results) {
      if (results.length > 0) {
        const result = results[0];

        updateCover(id, {
          title: {
            search: result.title,
            text: result.title,
          },
          subtitle: {
            search: result.subtitle,
            text: result.subtitle,
          },
          link: result.link,
        });
        return;
      }
      throw new Error('NOT_FOUND');
    },
  });
};
