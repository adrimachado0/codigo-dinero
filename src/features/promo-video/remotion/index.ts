// Entry point for Remotion Studio and render (pnpm remotion:studio / remotion:render).
import { registerRoot } from "remotion";

import { RemotionRoot } from "./root";

registerRoot(RemotionRoot);
