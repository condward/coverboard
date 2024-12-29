import { validate } from 'uuid';
import { z } from 'zod';

import { PosTypes } from './generalTypes';
import { MAX_BOUNDARY } from './constants';

export const coverSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'covers:id must be a string',
      required_error: 'covers:id is required',
    })
    .refine((id) => {
      return validate(id);
    }, 'covers:id has invalid format'),
  link: z.string().url().or(z.literal('')),
  pos: z.object({
    x: z.coerce
      .number({
        invalid_type_error: 'covers:pos:x position must be a number',
        required_error: 'covers:pos:x is required',
      })
      .min(0, 'covers:x position must be positive number')
      .max(
        MAX_BOUNDARY,
        `covers:pos:x position must be less than ${MAX_BOUNDARY}`,
      ),
    y: z.coerce
      .number({
        invalid_type_error: 'covers:pos:y position must be a number',
        required_error: 'covers:pos:y is required',
      })
      .min(0, 'covers:y position must be positive number')
      .max(MAX_BOUNDARY, `covers:x position must be less than ${MAX_BOUNDARY}`),
  }),
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
    count: z.coerce
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
  .max(25, 'Only 25 covers are allowed');
export type CoversSchema = z.input<typeof coversSchema>;

export interface CoverLabelValue {
  title: string;
  subtitle: string;
}
export type CoverLabelValues = Array<CoverLabelValue>;
