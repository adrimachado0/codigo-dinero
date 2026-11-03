import "@/shared/lib/zod-csp";

import type { z } from "zod";

/**
 * Validates a section's copy when its module loads: a malformed content.ts fails the build
 * instead of rendering broken UI.
 */
export function defineContent<Schema extends z.ZodType>(
  schema: Schema,
  data: z.input<Schema>,
): z.output<Schema> {
  return schema.parse(data);
}
