import { validate } from 'uuid';
import { z } from 'zod';

import { PosTypes } from './generalTypes';
import { MAX_BOUNDARY } from './constants';

export const groupSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'groups:id must be a string',
      required_error: 'groups:id is required',
    })
    .refine((id) => {
      return validate(id);
    }, 'groups:id has invalid format'),
  pos: z.object({
    x: z.coerce
      .number({
        invalid_type_error: 'groups:pos:x position must be a number',
        required_error: 'groups:pos:x is required',
      })
      .min(0, 'groups:pos:x position must be positive number')
      .max(
        MAX_BOUNDARY,
        `groups:pos:x position must be less than ${MAX_BOUNDARY}`,
      ),
    y: z.coerce
      .number({
        invalid_type_error: 'groups:pos:y position must be a number',
        required_error: 'groups:pos:y is required',
      })
      .min(0, 'groups:pos:y position must be positive number')
      .max(
        MAX_BOUNDARY,
        `groups:pos:y position must be less than ${MAX_BOUNDARY}`,
      ),
  }),
  scale: z.object({
    x: z
      .number({
        invalid_type_error: 'groups:scale:x position must be a number',
        required_error: 'groups:scale:x is required',
      })
      .min(0, 'groups:x position must be positive number')
      .max(10),
    y: z
      .number({
        invalid_type_error: 'groups:scale:y position must be a number',
        required_error: 'groups:scale:y is required',
      })
      .min(0, 'groups:y position must be positive number')
      .max(10),
  }),
  title: z.object({
    text: z.string({
      invalid_type_error: 'groups:title:text must be a string',
      required_error: 'groups:title:text is required',
    }),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `groups:title:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  }),
  subtitle: z.object({
    text: z.string({
      invalid_type_error: 'groups:subtitle:text must be a string',
      required_error: 'groups:subtitle:text is required',
    }),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `groups:subtitle:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  }),
});
export type GroupSchema = z.input<typeof groupSchema>;
export type GroupSchemaOutput = z.output<typeof groupSchema>;

export const groupsSchema = z
  .array(groupSchema, {
    invalid_type_error: 'groups must be an array of objects',
    required_error: 'groups is required',
  })
  .max(25, 'Only 20 groups are allowed');
export type GroupsSchema = z.input<typeof groupsSchema>;
