import type { NextConfig } from "next";

// Validates the environment at config load, so `next build` fails fast on bad env.
import { env } from "./src/shared/config/env";

const isDev = process.env.NODE_ENV === "development";
// Production is served over HTTPS only. Tests and local builds run on plain HTTP, so the
// HTTPS-only rules are left out there.
const isProduction = env.SITE_ENV === "production";

// No nonces: the home is fully prerendered, and nonces require dynamic rendering
// (see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
// React needs 'unsafe-eval' only in development.
const contentSecurityPolicy = [
  "default-src 'self'",
  // TradingView widgets: the embed script comes from s3, the widget runs in its iframe.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://s3.tradingview.com`,
  "frame-src https://www.tradingview-widget.com https://s.tradingview.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  // Browsers remember for two years to use HTTPS only (no preload list: that is hard to undo).
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  headers() {
    return Promise.resolve([{ source: "/(.*)", headers: securityHeaders }]);
  },
};

export default nextConfig;
