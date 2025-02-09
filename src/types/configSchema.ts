import { z } from 'zod';

import { PosTypes } from './generalTypes';
import { MAX_BOUNDARY } from './constants';

export const Media = {
  MUSIC: 'music',
  MOVIE: 'movie',
  TVSHOW: 'tvshow',
  BOOK: 'book',
  GAME: 'game',
} as const;
export type Media = (typeof Media)[keyof typeof Media];

export const Colors = {
  YELLOW: 'yellow',
  RED: 'red',
  GREEN: 'green',
  PINK: 'pink',
  BLUE: 'blue',
  PURPLE: 'purple',
  ORANGE: 'orange',
} as const;
export type Colors = (typeof Colors)[keyof typeof Colors];

export const colorMap = {
  [Colors.YELLOW]: '#FFFF00',
  [Colors.RED]: '#DC143C',
  [Colors.GREEN]: '#32CD32',
  [Colors.PINK]: '#FF69B4',
  [Colors.BLUE]: '#1E90FF',
  [Colors.PURPLE]: '#9370DB',
  [Colors.ORANGE]: '#FF6347',
};

export const BackColors = {
  DARKER: 'darker',
  DARK: 'dark',
  LIGHT: 'light',
  LIGHTER: 'lighter',
} as const;
export type BackColors = (typeof BackColors)[keyof typeof BackColors];

export const backColorMap = {
  [BackColors.DARKER]: '#1E2B38',
  [BackColors.DARK]: '#303952',
  [BackColors.LIGHT]: '#475B6B',
  [BackColors.LIGHTER]: '#5C6F7E',
};

export const configSchema = z.object(
  {
    layout: z.object({
      scale: z.coerce
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
      color: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:layout:color must be ${Object.values(Colors).join(' | ')}`,
          };
        },
      }),
      backColor: z.nativeEnum(BackColors, {
        errorMap: () => {
          return {
            message: `configs:layout:backColor must be ${Object.values(
              BackColors,
            ).join(' | ')}`,
          };
        },
      }),
      helpers: z.boolean({
        invalid_type_error: 'configs:show:helpers must be a boolean',
        required_error: 'configs:show:helpers is required',
      }),
    }),
    media: z.nativeEnum(Media, {
      errorMap: () => {
        return {
          message: `configs:media must be ${Object.values(Media).join(' | ')}`,
        };
      },
    }),
    title: z.object({
      text: z
        .string({
          invalid_type_error: 'configs:title:text must be a string',
          required_error: 'configs:title:text is required',
        })
        .trim(),
      show: z.boolean({
        invalid_type_error: 'configs:title:show must be a boolean',
        required_error: 'configs:title:show is required',
      }),
    }),
    covers: z.object({
      color: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:covers:color must be ${Object.values(Colors).join(
              ' | ',
            )}`,
          };
        },
      }),
      title: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:covers:title:show must be a boolean',
          required_error: 'configs:covers:title:show is required',
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `configs:covers:title:dir must be ${Object.values(
                PosTypes,
              ).join(' | ')}`,
            };
          },
        }),
      }),
      subtitle: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:covers:suntitle:show must be a boolean',
          required_error: 'configs:covers:subtitle:show is required',
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `configs:covers:subtitle:dir must be ${Object.values(
                PosTypes,
              ).join(' | ')}`,
            };
          },
        }),
      }),
      rating: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:covers:rating:show must be a boolean',
          required_error: 'configs:covers:rating:show is required',
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `configs:covers:rating:dir must be ${Object.values(
                PosTypes,
              ).join(' | ')}`,
            };
          },
        }),
      }),
    }),
    groups: z.object({
      color: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:groups:title:show must be ${Object.values(
              Colors,
            ).join(' | ')}`,
          };
        },
      }),
      backColor: z.nativeEnum(BackColors, {
        errorMap: () => {
          return {
            message: `configs:colors:groupBack must be ${Object.values(
              BackColors,
            ).join(' | ')}`,
          };
        },
      }),
      title: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:groups:title:show must be a boolean',
          required_error: 'configs:groups:title:show is required',
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `configs:groups:title:dir must be ${Object.values(
                PosTypes,
              ).join(' | ')}`,
            };
          },
        }),
      }),
      subtitle: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:covers:subtitle:show must be a boolean',
          required_error: 'configs:covers:subtitle:show is required',
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `configs:covers:subtitle:dir must be ${Object.values(
                PosTypes,
              ).join(' | ')}`,
            };
          },
        }),
      }),
    }),
    arrows: z.object({
      color: z.nativeEnum(Colors, {
        errorMap: () => {
          return {
            message: `configs:colors:arrows must be ${Object.values(
              Colors,
            ).join(' | ')}`,
          };
        },
      }),
      title: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:arrows:title:show must be a boolean',
          required_error: 'configs:arrows:title:show is required',
        }),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `configs:arrows:title:dir must be ${Object.values(
                PosTypes,
              ).join(' | ')}`,
            };
          },
        }),
      }),
      circle: z.object({
        show: z.boolean({
          invalid_type_error: 'configs:show:arrows:circle must be a boolean',
          required_error: 'configs:show:arrows:circle is required',
        }),
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
