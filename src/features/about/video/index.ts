// Remotion Studio / render entry (pnpm remotion:studio, pnpm remotion:render). The site
// embeds the composition with @remotion/player and gets its fonts from next/font instead.
import { loadFont } from "@remotion/fonts";
import { registerRoot, staticFile } from "remotion";

import { RemotionRoot } from "./root";

void loadFont({ family: "Lexend", url: staticFile("fonts/lexend-latin.woff2"), weight: "100 900" });
void loadFont({
  family: "Unbounded",
  url: staticFile("fonts/unbounded-latin.woff2"),
  weight: "100 900",
});

registerRoot(RemotionRoot);
