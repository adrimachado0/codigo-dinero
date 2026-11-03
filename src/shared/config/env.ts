import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    QUOTES_PROVIDER: z.enum(["simulated"]).default("simulated"),
    /** Only "production" is indexable: everything else gets noindex (metadata + robots.txt). */
    SITE_ENV: z.enum(["development", "preview", "production"]).default("development"),
  },
  client: {
    // Production domain is pending (docs/PENDIENTES.md); localhost keeps dev and CI builds working.
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    QUOTES_PROVIDER: process.env.QUOTES_PROVIDER,
    SITE_ENV: process.env.SITE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  emptyStringAsUndefined: true,
});
