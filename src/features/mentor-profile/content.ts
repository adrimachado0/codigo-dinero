import { z } from "zod";

import { defineContent } from "@/shared/lib/content";
import { RichTextSchema } from "@/shared/lib/rich-text";

export const mentorContent = defineContent(
  z.object({
    eyebrow: z.string().min(1),
    titleLead: z.string().min(1),
    titleHighlight: z.string().min(1),
    /** Red caption over the photo (the role is shown in capitals). */
    name: z.string().min(1),
    role: z.string().min(1),
    intro: RichTextSchema,
    body: RichTextSchema,
    facts: z.array(z.object({ label: z.string().min(1), highlight: z.boolean() })).min(1),
    /** Goes to the Partner/IB sign-up. */
    primaryCta: z.string().min(1),
    /** Opens WhatsApp with the partner message. */
    partnerCta: z.string().min(1),
    /** Captions of the event photos (src/shared/config/photos.ts), in order. */
    events: z.object({ stand: z.string().min(1), moneyExpo: z.string().min(1) }),
  }),
  {
    eyebrow: "¿Quién soy?",
    titleLead: "Quién está detrás de",
    titleHighlight: "Código Dinero",
    name: "Ángel Jesús González",
    role: "BDM en EC Markets",
    intro: [
      "Hola, soy ",
      { strong: "Ángel Jesús González" },
      ". Tengo 46 años, vivo en Rosario y hace 2 años que me dedico al trading. Actualmente desempeño el rol de ",
      { strong: "BDM en EC Markets" },
      ".",
    ],
    body: [
      "Creé este espacio para conectar con personas que realmente quieren aprender esta profesión. Mi objetivo es acompañar a traders novatos en su formación, facilitarles cuentas demo para su práctica y, al mismo tiempo, convocar a traders con experiencia y líderes de comunidades que busquen asociarse, formar equipos de trabajo y aprovechar las condiciones preferenciales que ofrecemos junto a ",
      { strong: "EC Markets" },
      ".",
    ],
    facts: [
      { label: "46 años", highlight: false },
      { label: "Rosario", highlight: false },
      { label: "2 años en trading", highlight: false },
      { label: "BDM en EC Markets", highlight: true },
    ],
    primaryCta: "Quiero aprender desde cero",
    partnerCta: "Sumarme como Partner / IB",
    events: { stand: "Stand de EC Markets", moneyExpo: "Money Expo Argentina" },
  },
);
