import { z } from "zod";

/** Copy with bold runs: plain strings and `{ strong }` segments, rendered by `RichText`. */
export const RichTextSchema = z
  .array(z.union([z.string().min(1), z.object({ strong: z.string().min(1) })]))
  .min(1);

export type RichTextValue = z.output<typeof RichTextSchema>;

/** The same copy as plain text (alt texts, metadata, tests). */
export function richTextToPlain(value: RichTextValue): string {
  return value.map((segment) => (typeof segment === "string" ? segment : segment.strong)).join("");
}
