// Remotion CLI config (Studio and render). Its bundler doesn't read tsconfig paths, so the
// "@/" alias used by the composition is mapped here.
import path from "node:path";

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPublicDir("public");

Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias as Record<string, string> | undefined),
      "@": path.join(process.cwd(), "src"),
    },
  },
}));
