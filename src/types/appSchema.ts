import { z } from 'zod';

import { coversSchema } from './coverSchema';
import { groupsSchema } from './groupSchema';
import { configSchema } from './configSchema';
import { lineSchemas } from './lineSchema';

export const appSchema = z.object({
  configs: configSchema,
  covers: coversSchema,
  groups: groupsSchema,
  lines: lineSchemas,
});
export type AppSchema = z.infer<typeof appSchema>;
