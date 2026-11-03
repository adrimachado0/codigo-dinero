import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

const StatSchema = z.object({
  /** Value split around the red separator, e.g. ["MT4", "·", "MT5"]. */
  before: z.string(),
  accent: z.string().min(1),
  after: z.string(),
  label: z.string().min(1),
});

export const partnerContent = defineContent(
  z.object({
    badge: z.string().min(1),
    tagline: z.string().min(1),
    statsLabel: z.string().min(1),
    stats: z.array(StatSchema).length(4),
  }),
  {
    badge: "Partner oficial",
    tagline: "Broker multirregulado",
    statsLabel: "EC MARKETS en números",
    stats: [
      { before: "150", accent: "+", after: "", label: "Instrumentos en EC MARKETS" },
      { before: "MT4", accent: "·", after: "MT5", label: "Plataformas" },
      { before: "24", accent: "/", after: "5", label: "Soporte del broker" },
      { before: "0", accent: "7", after: "", label: "Activos en el ticker" },
    ],
  },
);
