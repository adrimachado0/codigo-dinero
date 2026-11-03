import { connection } from "next/server";

import { getLiveQuotes } from "@/features/market-ticker";

/** Ticker prices. Runs on every request (never cached); output validated with Zod. */
export async function GET() {
  await connection();
  return Response.json(getLiveQuotes(), { headers: { "Cache-Control": "no-store" } });
}
