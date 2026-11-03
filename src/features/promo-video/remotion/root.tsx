import { Composition } from "remotion";

import { PROMO_COMPOSITION, PromoCodigoDinero } from "./promo-codigo-dinero";

export function RemotionRoot() {
  return <Composition {...PROMO_COMPOSITION} component={PromoCodigoDinero} />;
}
