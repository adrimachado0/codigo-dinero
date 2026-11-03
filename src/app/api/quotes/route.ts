import { connection } from "next/server";

import { getLiveTickerQuotes, QuoteSnapshotSchema } from "@/features/market-ticker";

/** HTTP adapter for the ticker: always at request time, output validated with Zod. */
export async function GET() {
  await connection();
  const snapshot = QuoteSnapshotSchema.parse(await getLiveTickerQuotes());
  return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
