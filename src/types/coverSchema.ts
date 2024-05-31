import { validate } from 'uuid';
import { z } from 'zod';

import { PosTypes } from './generalTypes';

export const coverSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'covers:id must be a string',
      required_error: 'covers:id is required',
    })
    .refine((id) => {
      return validate(id);
    }, 'covers:id has invalid format'),
  link: z.string().url(),
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
      .trim(),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `covers:dir must be ${Object.values(PosTypes).join(' | ')}`,
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
      .trim(),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `covers:dir must be ${Object.values(PosTypes).join(' | ')}`,
        };
      },
    }),
  }),
  star: z.object({
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `covers:star:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
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
});
export type CoverSchema = z.input<typeof coverSchema>;
export type CoverSchemaOutput = z.output<typeof coverSchema>;

export const coversSchema = z
  .array(coverSchema, {
    invalid_type_error: 'covers must be an array of objects',
    required_error: 'covers is required',
  })
  .max(20, 'Only 20 covers are allowed');
export type CoversSchema = z.input<typeof coversSchema>;

export type CoverLabelValue = {
  title: string;
  subtitle: string;
};
export type CoverLabelValues = Array<CoverLabelValue>;
