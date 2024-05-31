import axios from 'axios';
import { z } from 'zod';

import { ApiKeys, CoverLabelValues, SearchResults } from 'types';
import { apiKeysAtom, store } from 'store';
import { isFulfilled } from 'utils';

import { BASE_URL } from './base';

const imdbApiMovieSchema = z.object({
  data: z.array(
    z.object({
      adult: z.boolean(),
      backdrop_path: z.string().nullable(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      original_language: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string().nullable(),
      release_date: z.string(),
      title: z.string(),
      video: z.boolean(),
      vote_average: z.number(),
      vote_count: z.number(),
    }),
  ),
});

export const getMoviePosters = async (
  movieTitles: CoverLabelValues,
  apiKey?: string,
): Promise<SearchResults> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`${BASE_URL}/api/get-movie`, {
        params: {
          query: movie.title,
          ...(movie.subtitle && { year: movie.subtitle }),
          secret: apiKey ?? store.get(apiKeysAtom)[ApiKeys.TMDB],
        },
      });
    }),
  );

  return posters
    .filter(isFulfilled)
    .map(({ value }) => imdbApiMovieSchema.parse(value))
    .flatMap((poster) => {
      const movies = poster.data;

      if (movies.length > 0 && movies[0].poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/original${movies[0].poster_path}`;
        return {
          link: posterUrl,
          title: movies[0].original_title,
          subtitle: movies[0].release_date.slice(0, 4),
        };
      }

      return [];
    });
};

const imdbApitvShowSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      adult: z.boolean(),
      backdrop_path: z.string().nullable(),
      first_air_date: z.string(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      original_language: z.string(),
      original_name: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string().nullable(),
      vote_average: z.number(),
      vote_count: z.number(),
    }),
  ),
});

export const getTvShowPosters = async (
  movieTitles: CoverLabelValues,
  apiKey?: string,
): Promise<SearchResults> => {
  const posters = await Promise.allSettled(
    movieTitles.map((movie) => {
      return axios.get(`${BASE_URL}/api/get-tv`, {
        params: {
          query: movie.title,
          ...(movie.subtitle && { year: movie.subtitle }),
          secret: apiKey ?? store.get(apiKeysAtom)[ApiKeys.TMDB],
        },
      });
    }),
  );

  return posters
    .filter(isFulfilled)
    .map(({ value }) => imdbApitvShowSchema.parse(value))
    .flatMap((poster) => {
      const movies = poster.data;

      if (movies.length > 0 && movies[0].poster_path) {
        const posterUrl = `https://image.tmdb.org/t/p/original${movies[0].poster_path}`;
        return {
          link: posterUrl,
          title: movies[0].name,
          subtitle: movies[0].first_air_date.slice(0, 4),
        };
      }

      return [];
    });
};
