import { validate } from 'uuid';
import { z } from 'zod';

import { PosTypes } from './generalTypes';

const ArrowPointSchema = z.object({
  id: z.string(),
  dir: z.nativeEnum(PosTypes),
});
export type ArrowPointSchema = z.input<typeof ArrowPointSchema>;

export const ArrowSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'arrows:id must be a string',
      required_error: 'arrows:id is required',
    })
    .refine((id) => {
      return validate(id);
    }, 'arrows:id has invalid format'),
  title: z.object({
    text: z
      .string({
        invalid_type_error: 'arrows:title:text must be a string',
        required_error: 'arrows:title:text is required',
      })
      .trim(),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `arrows:title:dir must be ${Object.values(PosTypes).join(' | ')}`,
        };
      },
    }),
  }),
  origin: ArrowPointSchema.extend({
    id: z
      .string({
        invalid_type_error: 'arrows:origin:id must be a string',
        required_error: 'arrows:origin:id is required',
      })
      .refine((id) => {
        return validate(id);
      }, 'arrows:origin:id has invalid format'),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `arrows:origin:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  }),
  target: ArrowPointSchema.extend({
    id: z
      .string({
        invalid_type_error: 'arrows:target:id must be a string',
        required_error: 'arrows:target:id is required',
      })
      .refine((id) => {
        return validate(id);
      }, 'arrows:target:id has invalid format'),
    dir: z.nativeEnum(PosTypes, {
      errorMap: () => {
        return {
          message: `arrows:target:dir must be ${Object.values(PosTypes).join(
            ' | ',
          )}`,
        };
      },
    }),
  }),
});

export type ArrowSchema = z.input<typeof ArrowSchema>;
export type ArrowSchemaOutput = z.output<typeof ArrowSchema>;

export const ArrowSchemas = z
  .array(ArrowSchema, {
    invalid_type_error: 'arrows must be an array of objects',
    required_error: 'arrows is required',
  })
  .max(50, 'Only 50 arrows are allowed');
export type ArrowsSchema = z.input<typeof ArrowSchemas>;

export interface ArrowParams {
  midX: number;
  midY: number;
  points: number[];
}
