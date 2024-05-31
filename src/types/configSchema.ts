import { z } from 'zod';

import { PosTypes } from './generalTypes';

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
    size: z
      .number({
        invalid_type_error: 'configs:size must be a number',
        required_error: 'configs:size is required',
      })
      .min(50, 'configs:size must be a number higher than 50')
      .max(150, 'configs:size must be a number lower than 150'),
    media: z.nativeEnum(Media, {
      errorMap: () => {
        return {
          message: `configs:media must be ${Object.values(Media).join(' | ')}`,
        };
      },
    }),
    title: z
      .string({
        invalid_type_error: 'configs:title must be a string',
        required_error: 'configs:title is required',
      })
      .trim(),
    color: z.nativeEnum(Colors, {
      errorMap: () => {
        return {
          message: `configs:color must be ${Object.values(Colors).join(' | ')}`,
        };
      },
    }),
    arrowColor: z.nativeEnum(Colors, {
      errorMap: () => {
        return {
          message: `configs:arrowColor must be ${Object.values(Colors).join(
            ' | ',
          )}`,
        };
      },
    }),
    coverColor: z.nativeEnum(Colors, {
      errorMap: () => {
        return {
          message: `configs:coverColor must be ${Object.values(Colors).join(
            ' | ',
          )}`,
        };
      },
    }),
    groupColor: z.nativeEnum(Colors, {
      errorMap: () => {
        return {
          message: `configs:groupColor must be ${Object.values(Colors).join(
            ' | ',
          )}`,
        };
      },
    }),
    backColor: z.nativeEnum(BackColors, {
      errorMap: () => {
        return {
          message: `configs:backColor must be ${Object.values(BackColors).join(
            ' | ',
          )}`,
        };
      },
    }),
    showTitle: z.boolean({
      invalid_type_error: 'configs:showTitle must be a boolean',
      required_error: 'configs:showTitle is required',
    }),
    showArrow: z.boolean({
      invalid_type_error: 'configs:showArrow must be a boolean',
      required_error: 'configs:showArrow is required',
    }),
    showSubtitle: z.boolean({
      invalid_type_error: 'configs:showSubtitle must be a boolean',
      required_error: 'configs:showSubtitle is required',
    }),
    showMainTitle: z.boolean({
      invalid_type_error: 'configs:showMainTitle must be a boolean',
      required_error: 'configs:showMainTitle is required',
    }),
    showStars: z.boolean({
      invalid_type_error: 'configs:showStars must be a boolean',
      required_error: 'configs:showStars is required',
    }),
    labelDir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `configs:labelDir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
    starsDir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `configs:starsDir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
    groupDir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `configs:starsDir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  },
  {
    invalid_type_error: 'configs must be a object',
    required_error: 'configs is required',
  },
);
export type ConfigSchema = z.input<typeof configSchema>;
export type ConfigSchemaOutput = z.output<typeof configSchema>;

const createTypedObject = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, key]),
  ) as {
    [K in keyof T]: K;
  };
};
export const ToolbarConfigValues = createTypedObject(configSchema);
