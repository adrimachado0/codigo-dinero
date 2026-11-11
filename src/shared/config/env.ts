import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// On Vercel the deploy works without configuring anything: the environment comes from
// VERCEL_ENV and the canonical domain from the project's production URL (both set by Vercel;
// the NEXT_PUBLIC_ one is exposed to Next.js builds automatically). Explicit values win.
const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

export const env = createEnv({
  server: {
    /** Only "production" is indexable: everything else gets noindex (metadata + robots.txt). */
    SITE_ENV: z.enum(["development", "preview", "production"]).default("development"),
  },
  client: {
    // localhost keeps dev and CI builds working.
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    // `||`, not `??`: an empty value set in the dashboard also falls back.
    SITE_ENV: process.env.SITE_ENV || process.env.VERCEL_ENV,
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ||
      (vercelProductionUrl ? `https://${vercelProductionUrl}` : undefined),
  },
  emptyStringAsUndefined: true,
});
