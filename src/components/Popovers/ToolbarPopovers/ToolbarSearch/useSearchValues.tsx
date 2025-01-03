import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';

import {
  getLastFMAlbums,
  getMoviePosters,
  getBookCovers,
  getGames,
  getTvShowPosters,
} from 'api';

import { useShallowMainStore, useShowToast } from 'store';
import { Media, SearchSchema } from 'types';

export const useSearchValues = () => {
  const { showSuccessMessage, showErrorMessage } = useShowToast();
  const { media, getCovers, starsDir, labelDir, labelSubDir, addCovers } =
    useShallowMainStore((state) => ({
      starsDir: state.configs.covers.rating.dir,
      labelDir: state.configs.covers.title.dir,
      labelSubDir: state.configs.covers.subtitle.dir,
      addCovers: state.addCovers,
      getCovers: state.getCovers,
      media: state.configs.media,
    }));
  const covers = getCovers();

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
    onSuccess(results, request) {
      const resultLength = results.length;

      const filtereResults = results.filter(
        (filteredResult) =>
          !covers.some(
            (star) =>
              star.title.search === filteredResult.title &&
              star.subtitle.search === filteredResult.subtitle,
          ),
      );

      if (filtereResults.length > 0) {
        addCovers(
          filtereResults.map((filteredResult) => ({
            id: uuidv4(),
            link: filteredResult.link,
            pos: {
              x: 0,
              y: 0,
            },
            title: {
              search: filteredResult.title,
              text: filteredResult.title,
              dir: labelDir,
            },
            subtitle: {
              search: filteredResult.subtitle,
              text: filteredResult.subtitle,
              dir: labelSubDir,
            },
            star: {
              dir: starsDir,
              count: 0,
            },
          })),
        );
        showSuccessMessage(
          `${filtereResults.length}/${request.length} results found`,
        );
      } else {
        showErrorMessage(
          resultLength === filtereResults.length
            ? 'Result not found'
            : 'Result already exists on the board',
        );
      }
    },
    onError(error) {
      if (error instanceof ZodError) {
        const tooBig = error.issues.find((msg) => msg.code === 'too_big');

        if (tooBig) {
          showErrorMessage(tooBig.message);
          return;
        }
        showErrorMessage('Bad response from the server');
        return;
      }
      showErrorMessage('Failed to fetch from the server');
    },
  });
};
