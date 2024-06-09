import { z } from 'zod';
import { validate } from 'uuid';

import { PosTypes } from './generalTypes';
import { MAX_BOUNDARY } from './constants';

export const bulkUpdateCoverSchema = z.object({
  ids: z.array(
    z
      .string({
        invalid_type_error: 'covers:id must be a string',
        required_error: 'covers:id is required',
      })
      .refine((id) => {
        return validate(id);
      }, 'covers:id has invalid format'),
  ),
  pos: z.object({
    x: z.coerce
      .number({
        invalid_type_error: 'covers:pos:x position must be a number',
        required_error: 'covers:pos:x is required',
      })
      .min(-1, 'covers:pos:x position must be positive number')
      .max(
        MAX_BOUNDARY,
        `covers:pos:x position must be less than ${MAX_BOUNDARY}`,
      ),
    y: z.coerce
      .number({
        invalid_type_error: 'covers:pos:y position must be a number',
        required_error: 'covers:pos:y is required',
      })
      .min(-1, 'covers:pos:y position must be positive number')
      .max(
        MAX_BOUNDARY,
        `covers:pos:y position must be less than ${MAX_BOUNDARY}`,
      ),
  }),
  pace: z.object({
    x: z.coerce
      .number({
        invalid_type_error: 'covers:pace:x position must be a number',
        required_error: 'covers:pace:x is required',
      })
      .min(0, 'covers:pace:x position must be positive number')
      .max(
        MAX_BOUNDARY,
        `covers:pace:x position must be less than ${MAX_BOUNDARY}`,
      ),
    y: z.coerce
      .number({
        invalid_type_error: 'covers:pace:y position must be a number',
        required_error: 'covers:pace:y is required',
      })
      .min(0, 'covers:pace:y position must be positive number')
      .max(
        MAX_BOUNDARY,
        `covers:pace:y position must be less than ${MAX_BOUNDARY}`,
      ),
  }),
  title: z.object({
    dir: z
      .nativeEnum(PosTypes, {
        errorMap: () => {
          return {
            message: `covers:dir must be ${Object.values(PosTypes).join(' | ')}`,
          };
        },
      })
      .or(z.literal('none')),
  }),
  subtitle: z.object({
    dir: z
      .nativeEnum(PosTypes, {
        errorMap: () => {
          return {
            message: `covers:dir must be ${Object.values(PosTypes).join(' | ')}`,
          };
        },
      })
      .or(z.literal('none')),
  }),
  star: z.object({
    dir: z
      .nativeEnum(PosTypes, {
        errorMap: () => {
          return {
            message: `covers:star:dir must be ${Object.values(PosTypes).join(
              ' | ',
            )}`,
          };
        },
      })
      .or(z.literal('none')),
    count: z
      .number({
        invalid_type_error: 'covers:star:count must be a number',
        required_error: 'covers:star:count is required',
      })
      .min(-1, 'covers:star:count must be positive number')
      .max(5, 'covers:star:count  must be less than 5'),
  }),
});
export type BulkUpdateCoverSchema = z.input<typeof bulkUpdateCoverSchema>;
export type BulkUpdateCoverSchemaOutput = z.output<
  typeof bulkUpdateCoverSchema
>;

export const bulkUpdateCoversSchema = z
  .array(bulkUpdateCoverSchema, {
    invalid_type_error: 'covers must be an array of objects',
    required_error: 'covers is required',
  })
  .max(25, 'Only 25 covers are allowed');
export type BulkUpdateCoversSchema = z.input<typeof bulkUpdateCoversSchema>;
