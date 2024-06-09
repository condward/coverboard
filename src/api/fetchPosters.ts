import { z } from 'zod';

import { CoverLabelValues, Media, SearchResults } from 'types';

import { apiFetch } from './base';

const imdbApiMovieSchema = z.array(
  z.object({
    original_title: z.string(),
    poster_path: z.string().nullable(),
    release_date: z.string(),
  }),
);

export const getMoviePosters = async (
  coverArray: CoverLabelValues,
  secret?: string,
): Promise<SearchResults> => {
  const covers = await apiFetch(Media.MOVIE, coverArray, secret);

  return covers.flatMap(({ data, index }) => {
    const result = imdbApiMovieSchema.parse(data);

    return result.length > 0 && result[0].poster_path
      ? {
          link: `https://image.tmdb.org/t/p/original${result[0].poster_path}`,
          title: result[0].original_title,
          subtitle: result[0].release_date.slice(0, 4),
          index,
        }
      : [];
  });
};

const imdbApitvShowSchema = z.array(
  z.object({
    name: z.string(),
    first_air_date: z.string(),
    poster_path: z.string().nullable(),
  }),
);

export const getTvShowPosters = async (
  coverArray: CoverLabelValues,
  secret?: string,
): Promise<SearchResults> => {
  const covers = await apiFetch(Media.MOVIE, coverArray, secret);

  return covers.flatMap(({ data, index }) => {
    const result = imdbApitvShowSchema.parse(data);

    return result.length > 0 && result[0].poster_path
      ? {
          link: `https://image.tmdb.org/t/p/original${result[0].poster_path}`,
          title: result[0].name,
          subtitle: result[0].first_air_date.slice(0, 4),
          index,
        }
      : [];
  });
};
