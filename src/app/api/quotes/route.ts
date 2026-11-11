import { connection } from "next/server";

import { getLiveQuotes } from "@/features/market-ticker";

/** Header strip prices (Yahoo Finance, cached a minute on the server; see live-quotes.ts). */
export async function GET() {
  await connection();
  return Response.json(await getLiveQuotes(), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60" },
  });
}
