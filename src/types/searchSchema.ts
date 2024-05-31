import { z } from 'zod';

import { Media } from './configSchema';

export const searchSchema = ({
  titleLabel,
  subTitleLabel,
}: {
  titleLabel: MediaDesc;
  subTitleLabel: MediaDesc;
}) =>
  z.object({
    search: z
      .array(
        z
          .object({
            title: z.string(),
            subtitle: z.string(),
          })
          .refine((value) => {
            if (
              value.title === '' &&
              value.subtitle !== '' &&
              titleLabel.required
            ) {
              return false;
            } else if (
              value.title !== '' &&
              value.subtitle === '' &&
              subTitleLabel.required
            ) {
              return false;
            } else if (
              subTitleLabel.label === MediaValues.YEAR &&
              value.subtitle.length > 0
            ) {
              if (value.subtitle.length !== 4) return false;
              if (!/^[12]\d{3}$/.test(value.subtitle)) return false;
            }
            return true;
          }),
      )
      .min(1)
      .max(5)
      .transform((values) => {
        return values.filter(
          (currentValue) =>
            !(currentValue.title === '' && currentValue.subtitle === ''),
        );
      }),
  });

export type SearchSchema = z.input<ReturnType<typeof searchSchema>>;
export type SearchSchemaOutput = z.output<ReturnType<typeof searchSchema>>;

export enum MediaValues {
  ARTIST = 'artist',
  ALBUM = 'album',
  MOVIE = 'movie',
  TVSHOW = 'tvshow',
  YEAR = 'year',
  BOOK = 'book',
  AUTHOR = 'author',
  GAME = 'game',
}

export interface MediaDesc {
  label: MediaValues;
  required: boolean;
  hidden: boolean;
}

export enum ApiKeys {
  LAST_FM = 'lastFM',
  TMDB = 'The movie DB',
  RAWG = 'Rawg',
}

type MediaMapRecord = Record<
  Media,
  {
    emoji: string;
    title: MediaDesc;
    subtitle: MediaDesc;
    heightRatio: number;
    apiName: ApiKeys | null;
  }
>;

export const MediaMap: MediaMapRecord = {
  [Media.MUSIC]: {
    emoji: '🎵',
    title: {
      label: MediaValues.ALBUM,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.ARTIST,
      required: true,
      hidden: false,
    },
    heightRatio: 1,
    apiName: ApiKeys.LAST_FM,
  },
  [Media.MOVIE]: {
    emoji: '🎬',
    title: {
      label: MediaValues.MOVIE,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.YEAR,
      required: false,
      hidden: false,
    },
    heightRatio: 1.5,
    apiName: ApiKeys.TMDB,
  },
  [Media.TVSHOW]: {
    emoji: '📺',
    title: {
      label: MediaValues.TVSHOW,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.YEAR,
      required: false,
      hidden: false,
    },
    heightRatio: 1.5,
    apiName: ApiKeys.TMDB,
  },
  [Media.BOOK]: {
    emoji: '📚',
    title: {
      label: MediaValues.BOOK,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.AUTHOR,
      required: false,
      hidden: false,
    },
    heightRatio: 1.5,
    apiName: null,
  },
  [Media.GAME]: {
    emoji: '🎮',
    title: {
      label: MediaValues.GAME,
      required: true,
      hidden: false,
    },
    subtitle: {
      label: MediaValues.YEAR,
      required: false,
      hidden: false,
    },
    heightRatio: 0.7,
    apiName: ApiKeys.RAWG,
  },
};

export interface SearchResult {
  link: string;
  title: string;
  subtitle: string;
}
export type SearchResults = Array<SearchResult>;
