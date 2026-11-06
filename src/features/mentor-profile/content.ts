import { z } from "zod";

import { defineContent } from "@/shared/lib/content";
import { RichTextSchema } from "@/shared/lib/rich-text";

const LinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

export const mentorContent = defineContent(
  z.object({
    eyebrow: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    /** Red caption over the photo (the role is shown in capitals). */
    name: z.string().min(1),
    role: z.string().min(1),
    /** Shown while there is no photo (src/shared/config/photos.ts). */
    photoLabel: z.string().min(1),
    intro: RichTextSchema,
    body: RichTextSchema,
    facts: z.array(z.object({ label: z.string().min(1), highlight: z.boolean() })).min(1),
    primaryCta: LinkSchema,
    partnerCta: LinkSchema,
  }),
  {
    eyebrow: "¿Quién soy?",
    titleLead: "Quién está detrás de",
    titleHighlight: "Código Dinero",
    name: "Ángel González",
    role: "BDM en EC Markets",
    photoLabel: "Foto del mentor",
    intro: [
      "Hola, soy ",
      { strong: "Ángel González" },
      ". Tengo 45 años, vivo en Rosario y hace 2 años que me dedico al trading. Actualmente desempeño el rol de ",
      { strong: "BDM en EC Markets" },
      ".",
    ],
    body: [
      "Creé este espacio para conectar con personas que realmente quieren aprender esta profesión. Mi objetivo es acompañar a traders novatos en su formación, facilitarles cuentas demo para su práctica y, al mismo tiempo, convocar a traders con experiencia y líderes de comunidades que busquen asociarse, formar equipos de trabajo y aprovechar las condiciones preferenciales que ofrecemos junto a ",
      { strong: "EC Markets" },
      ".",
    ],
    facts: [
      { label: "45 años", highlight: false },
      { label: "Rosario", highlight: false },
      { label: "2 años en trading", highlight: false },
      { label: "BDM en EC Markets", highlight: true },
    ],
    primaryCta: { label: "Quiero aprender desde cero", href: "#contacto" },
    partnerCta: { label: "Sumarme como Partner / IB", href: "#contacto" },
  },
);
