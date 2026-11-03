import { z } from "zod";

import { defineContent } from "@/shared/lib/content";

export const headerContent = defineContent(
  z.object({
    navLabel: z.string().min(1),
    openMenuLabel: z.string().min(1),
    closeMenuLabel: z.string().min(1),
  }),
  {
    navLabel: "Principal",
    openMenuLabel: "Abrir menú",
    closeMenuLabel: "Cerrar menú",
  },
);
