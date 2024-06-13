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
    baseUrl: string | null;
    logoUrl: string;
    siteUrl: string;
  }
>;

export const mediaMap: MediaMapRecord = {
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
    baseUrl: '/api/get-album',
    logoUrl:
      'https://www.last.fm/static/images/footer_logo@2x.49ca51948b0a.png',
    siteUrl: 'https://www.last.fm',
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
    baseUrl: '/api/get-movie',
    logoUrl:
      'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg',
    siteUrl: 'https://www.themoviedb.org/',
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
    baseUrl: '/api/get-movie',
    logoUrl:
      'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg',
    siteUrl: 'https://www.themoviedb.org/',
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
    baseUrl: null,
    logoUrl:
      'https://blog.openlibrary.org/files/2016/02/Open-Library-Logo-1.jpg',
    siteUrl: 'https://openlibrary.org/',
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
    baseUrl: '/api/get-game',
    logoUrl:
      'https://rapidapi-prod-apis.s3.amazonaws.com/aa/5f399a9426449aac6954ffc8c0b481/ce9eeca1905fdb11890f3afc10724191.png',
    siteUrl: 'https://rawg.io/',
  },
};

export interface SearchResult {
  link: string;
  title: string;
  subtitle: string;
  index: number;
}
export type SearchResults = Array<SearchResult>;
