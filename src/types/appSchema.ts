import { z } from 'zod';

import { coversSchema } from './coverSchema';
import { groupsSchema } from './groupSchema';
import { configSchema } from './configSchema';
import { ArrowSchemas } from './arrowSchema';

export const appSchema = z.object({
  configs: configSchema,
  covers: coversSchema,
  groups: groupsSchema,
  arrows: ArrowSchemas,
});
export type AppSchema = z.infer<typeof appSchema>;
