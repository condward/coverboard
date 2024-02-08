import axios from 'axios';
import { CoverLabelValues, SearchResults } from 'types';
import { BASE_URL } from './base';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getGames = async (
  movieTitles: Array<CoverLabelValues>,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    movieTitles.map((game) => {
      return axios.get(`${BASE_URL}/api/get-game`, {
        params: {
          game: game.title,
          ...(game.subtitle && { year: game.subtitle }),
        },
      });
    }),
  );

  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap(({ value: game }) => {
    const gameCount = game.data ?? [];

    if (gameCount.length > 0) {
      const link = gameCount[0].background_image;
      return {
        link,
        title: gameCount[0].name,
        subtitle: gameCount[0].released.substring(0, 4),
      };
    }

    return [];
  });
};
