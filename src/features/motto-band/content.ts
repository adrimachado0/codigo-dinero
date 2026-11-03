import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const mottoContent = defineContent(
  z.object({
    label: z.string().min(1),
    words: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
  }),
  {
    label: "Aprende, analiza, opera",
    words: ["Aprende", "Analiza", "Opera"],
  },
);
