/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{ts,tsx,mts,js,mjs,cjs}": [
    "eslint --max-warnings=0 --no-warn-ignored --fix",
    "prettier --write --ignore-unknown",
  ],
  "*.{json,md,css,yaml,yml}": "prettier --write --ignore-unknown",
};

export default config;
