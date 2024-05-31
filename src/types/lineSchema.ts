import { validate } from 'uuid';
import { z } from 'zod';

import { PosTypes } from './generalTypes';

const linePointSchema = z.object({
  id: z.string(),
  dir: z.nativeEnum(PosTypes),
});
export type LinePointSchema = z.input<typeof linePointSchema>;

export const lineSchema = z.object({
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
    .trim(),
  dir: z.nativeEnum(PosTypes, {
    errorMap: () => {
      return {
        message: `lines:dir must be ${Object.values(PosTypes).join(' | ')}`,
      };
    },
  }),
  origin: linePointSchema.extend({
    id: z
      .string({
        invalid_type_error: 'lines:origin:id must be a string',
        required_error: 'lines:origin:id is required',
      })
      .refine((id) => {
        return validate(id);
      }, 'lines:origin:id has invalid format'),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `lines:origin:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  }),
  target: linePointSchema.extend({
    id: z
      .string({
        invalid_type_error: 'lines:target:id must be a string',
        required_error: 'lines:target:id is required',
      })
      .refine((id) => {
        return validate(id);
      }, 'lines:target:id has invalid format'),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `lines:target:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  }),
});
export type LineSchema = z.input<typeof lineSchema>;
export type LineSchemaOutput = z.output<typeof lineSchema>;

export const lineSchemas = z
  .array(lineSchema, {
    invalid_type_error: 'lines must be an array of objects',
    required_error: 'lines is required',
  })
  .max(20, 'Only 40 lines are allowed');
export type LinesSchema = z.input<typeof lineSchemas>;

export interface LineParams {
  midX: number;
  midY: number;
  points: number[];
}
