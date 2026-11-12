import { Composition } from "remotion";

import { CandlesExplainer } from "./candles-explainer";
import { CANDLES_VIDEO } from "./theme";

export function RemotionRoot() {
  return <Composition {...CANDLES_VIDEO} component={CandlesExplainer} />;
}
