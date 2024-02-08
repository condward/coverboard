import { BackColors, Colors, Media, ToolbarConfigParams } from './configTypes';
import { Covers, GroupCovers } from './coverTypes';
import { Lines } from './lineTypes';
import { z } from 'zod';
import { PosTypes } from './generalTypes';
import { validate } from 'uuid';

export enum LocalStorageKeys {
  COVER = 'covers',
  LINES = 'lines',
  CONFIG = 'configs',
  GROUP = 'groups',
}

export interface LocalStorageData {
  [LocalStorageKeys.CONFIG]: ToolbarConfigParams;
  [LocalStorageKeys.COVER]: Array<Covers>;
  [LocalStorageKeys.LINES]: Array<Lines>;
  [LocalStorageKeys.GROUP]: Array<GroupCovers>;
}

export const schema = (parsedData: LocalStorageData) =>
  z.object({
    configs: z.object(
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
              message: `configs:media must be ${Object.values(Media).join(
                ' | ',
              )}`,
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
              message: `configs:color must be ${Object.values(Colors).join(
                ' | ',
              )}`,
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
              message: `configs:backColor must be ${Object.values(
                BackColors,
              ).join(' | ')}`,
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
    ),
    covers: z.array(
      z.object({
        id: z
          .string({
            invalid_type_error: 'covers:id must be a string',
            required_error: 'covers:id is required',
          })
          .refine((id) => {
            return validate(id);
          }, 'covers:id has invalid format'),
        link: z
          .string()
          .url() /* .includes('https://lastfm.freetls.fastly.net'), */,
        x: z
          .number({
            invalid_type_error: 'covers:x position must be a number',
            required_error: 'covers:x is required',
          })
          .min(0, 'covers:x position must be positive number'),
        y: z
          .number({
            invalid_type_error: 'covers:y position must be a number',
            required_error: 'covers:y is required',
          })
          .min(0, 'covers:y position must be positive number'),
        title: z.object({
          search: z.string({
            invalid_type_error: 'covers:search must be a string',
            required_error: 'covers:search is required',
          }),
          text: z
            .string({
              invalid_type_error: 'covers:text must be a string',
              required_error: 'covers:text is required',
            })
            .trim()
            .nullable(),
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `covers:dir must be ${Object.values(PosTypes).join(
                  ' | ',
                )}`,
              };
            },
          }),
        }),
        subtitle: z.object({
          search: z.string({
            invalid_type_error: 'covers:search must be a string',
            required_error: 'covers:search is required',
          }),
          text: z
            .string({
              invalid_type_error: 'covers:text must be a string',
              required_error: 'covers:text is required',
            })
            .trim()
            .nullable(),
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `covers:dir must be ${Object.values(PosTypes).join(
                  ' | ',
                )}`,
              };
            },
          }),
        }),
        star: z.object({
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `covers:star:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
          count: z
            .number({
              invalid_type_error: 'covers:star:count must be a number',
              required_error: 'covers:star:count is required',
            })
            .min(0, 'covers:star:count must be positive number')
            .max(5, 'covers:star:count  must be less than 5'),
        }),
      }),
      {
        invalid_type_error: 'covers must be an array of objects',
        required_error: 'covers is required',
      },
    ),
    groups: z.array(
      z.object({
        id: z
          .string({
            invalid_type_error: 'groups:id must be a string',
            required_error: 'groups:id is required',
          })
          .refine((id) => {
            return validate(id);
          }, 'groups:id has invalid format'),
        x: z
          .number({
            invalid_type_error: 'groups:x position must be a number',
            required_error: 'groups:x is required',
          })
          .min(0, 'groups:x position must be positive number'),
        y: z
          .number({
            invalid_type_error: 'groups:y position must be a number',
            required_error: 'groups:y is required',
          })
          .min(0, 'groups:y position must be positive number'),
        scaleX: z
          .number({
            invalid_type_error: 'groups:x position must be a number',
            required_error: 'groups:x is required',
          })
          .min(0, 'groups:x position must be positive number'),
        scaleY: z
          .number({
            invalid_type_error: 'groups:y position must be a number',
            required_error: 'groups:y is required',
          })
          .min(0, 'groups:y position must be positive number'),
        title: z.object({
          text: z
            .string({
              invalid_type_error: 'groups:title:text must be a string',
              required_error: 'groups:title:text is required',
            })
            .nullable(),
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `groups:title:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
        }),
        subtitle: z.object({
          text: z
            .string({
              invalid_type_error: 'groups:subtitle:text must be a string',
              required_error: 'groups:subtitle:text is required',
            })
            .nullable(),
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `groups:subtitle:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
        }),
      }),
    ),
    lines: z.array(
      z.object({
        id: z
          .string({
            invalid_type_error: 'lines:id must be a string',
            required_error: 'lines:id is required',
          })
          .refine((id) => {
            return validate(id);
          }, 'lines:id has invalid format'),
        text: z
          .string({
            invalid_type_error: 'lines:text must be a string',
            required_error: 'lines:text is required',
          })
          .trim()
          .nullable(),
        dir: z.nativeEnum(PosTypes, {
          errorMap: () => {
            return {
              message: `lines:dir must be ${Object.values(PosTypes).join(
                ' | ',
              )}`,
            };
          },
        }),
        origin: z.object({
          id: z
            .string({
              invalid_type_error: 'lines:origin:id must be a string',
              required_error: 'lines:origin:id is required',
            })
            .refine((id) => {
              return validate(id);
            }, 'lines:origin:id has invalid format')
            .refine((id) => {
              return (
                parsedData.covers.find((cover) => cover.id === id) ||
                parsedData.groups.find((group) => group.id === id)
              );
            }, 'lines:origin:id does not exist'),
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `lines:origin:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
        }),
        target: z.object({
          id: z
            .string({
              invalid_type_error: 'lines:target:id must be a string',
              required_error: 'lines:target:id is required',
            })
            .refine((id) => {
              return validate(id);
            }, 'lines:target:id has invalid format')
            .refine((id) => {
              return (
                parsedData.covers.find((cover) => cover.id === id) ||
                parsedData.groups.find((group) => group.id === id)
              );
            }, 'lines:target:id does not exist'),
          dir: z.nativeEnum(PosTypes, {
            errorMap: () => {
              return {
                message: `lines:target:dir must be ${Object.values(
                  PosTypes,
                ).join(' | ')}`,
              };
            },
          }),
        }),
      }),
      {
        invalid_type_error: 'lines must be an array of objects',
        required_error: 'lines is required',
      },
    ),
  });
