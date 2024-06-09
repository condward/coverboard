import { z } from 'zod';

import { PosTypes } from './generalTypes';
import { MAX_BOUNDARY } from './constants';

export enum Media {
  MUSIC = 'music',
  MOVIE = 'movie',
  TVSHOW = 'tvshow',
  BOOK = 'book',
  GAME = 'game',
}

export enum Colors {
  YELLOW = 'yellow',
  RED = 'red',
  GREEN = 'green',
  PINK = 'pink',
  BLUE = 'blue',
  PURPLE = 'purple',
  ORANGE = 'orange',
}

export const colorMap = {
  [Colors.YELLOW]: '#FFFF00',
  [Colors.RED]: '#DC143C',
  [Colors.GREEN]: '#32CD32',
  [Colors.PINK]: '#FF69B4',
  [Colors.BLUE]: '#1E90FF',
  [Colors.PURPLE]: '#9370DB',
  [Colors.ORANGE]: '#FF6347',
};

export enum BackColors {
  DARKER = 'darker',
  DARK = 'dark',
  LIGHT = 'light',
  LIGHTER = 'lighter',
}

export const backColorMap = {
  [BackColors.DARKER]: '#1E2B38',
  [BackColors.DARK]: '#303952',
  [BackColors.LIGHT]: '#475B6B',
  [BackColors.LIGHTER]: '#5C6F7E',
};

export const configSchema = z.object(
  {
    layout: z.object({
      title: z
        .string({
          invalid_type_error: 'configs:title must be a string',
          required_error: 'configs:title is required',
        })
        .trim(),
      scale: z
        .number({
          invalid_type_error: 'configs:layout.scale must be a number',
          required_error: 'configs:layout.scale is required',
        })
        .min(50, 'configs:layout.scale must be a number higher than 50')
        .max(150, 'configs:layout.scale must be a number lower than 150'),
      fitToScreen: z.boolean(),
      width: z.coerce
        .number({
          invalid_type_error: 'configs:layout.width must be a number',
          required_error: 'configs:layout.width is required',
        })
        .min(500, 'configs:layout.width must be a number higher than 500')
        .max(
          MAX_BOUNDARY,
          `configs:layout.width must be a number lower than ${MAX_BOUNDARY}`,
        ),
      height: z.coerce
        .number({
          invalid_type_error: 'configs:layout.height must be a number',
          required_error: 'configs:layout.height is required',
        })
        .min(500, 'configs:layout.height must be a number higher than 500')
        .max(
          MAX_BOUNDARY,
          `configs:layout.height must be a number lower than ${MAX_BOUNDARY}`,
        ),
    }),
    media: z.nativeEnum(Media, {
      errorMap: () => {
        return {
          message: `configs:media must be ${Object.values(Media).join(' | ')}`,
        };
      },
    }),
    colors: z.object({
      main: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:colors:main must be ${Object.values(Colors).join(' | ')}`,
          };
        },
      }),
      arrows: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:colors:arrows must be ${Object.values(
              Colors,
            ).join(' | ')}`,
          };
        },
      }),
      covers: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:colors:covers must be ${Object.values(
              Colors,
            ).join(' | ')}`,
          };
        },
      }),
      groups: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:colors:groups must be ${Object.values(
              Colors,
            ).join(' | ')}`,
          };
        },
      }),
      groupsBack: z.nativeEnum(BackColors, {
        errorMap: () => {
          return {
            message: `configs:colors:groupBack must be ${Object.values(
              BackColors,
            ).join(' | ')}`,
          };
        },
      }),
      mainBack: z.nativeEnum(BackColors, {
        errorMap: () => {
          return {
            message: `configs:colors:mainBack must be ${Object.values(
              BackColors,
            ).join(' | ')}`,
          };
        },
      }),
    }),
    visibility: z.object({
      titles: z.boolean({
        invalid_type_error: 'configs:visibility:titles must be a boolean',
        required_error: 'configs:visibility:titles is required',
      }),
      arrows: z.boolean({
        invalid_type_error: 'configs:visibility:arrows must be a boolean',
        required_error: 'configs:visibility:arrows is required',
      }),
      subtitles: z.boolean({
        invalid_type_error: 'configs:visibility:subtitles must be a boolean',
        required_error: 'configs:visibility:subtitles is required',
      }),
      mainTitle: z.boolean({
        invalid_type_error: 'configs:visibility:mainTitle must be a boolean',
        required_error: 'configs:visibility:mainTitle is required',
      }),
      stars: z.boolean({
        invalid_type_error: 'configs:visibility:stars must be a boolean',
        required_error: 'configs:visibility:stars is required',
      }),
      helpers: z.boolean({
        invalid_type_error: 'configs:visibility:helpers must be a boolean',
        required_error: 'configs:visibility:helpers is required',
      }),
    }),
    dir: z.object({
      covers: z.nativeEnum(PosTypes, {
        errorMap: () => {
          return {
            message: `configs:dir:covers must be ${Object.values(PosTypes).join(
              ' | ',
            )}`,
          };
        },
      }),
      stars: z.nativeEnum(PosTypes, {
        errorMap: () => {
          return {
            message: `configs:dir:stars must be ${Object.values(PosTypes).join(
              ' | ',
            )}`,
          };
        },
      }),
      groups: z.nativeEnum(PosTypes, {
        errorMap: () => {
          return {
            message: `configs:dir:groups must be ${Object.values(PosTypes).join(
              ' | ',
            )}`,
          };
        },
      }),
    }),
  },
  {
    invalid_type_error: 'configs must be a object',
    required_error: 'configs is required',
  },
);
export type ConfigSchema = z.input<typeof configSchema>;
export type ConfigSchemaOutput = z.output<typeof configSchema>;
