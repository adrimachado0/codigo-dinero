import { describe, expect, it } from "vitest";

import { toQuoteView } from "./quote";

describe("toQuoteView", () => {
  it("formats like the reference: en-US grouping, fixed decimals, signed change", () => {
    expect(toQuoteView({ symbol: "BTCUSD", price: 80123.456, open: 80000, decimals: 1 })).toEqual({
      symbol: "BTCUSD",
      price: "80,123.5",
      change: "+0.15%",
      direction: "up",
    });
  });

  it("marks negative changes as down without a plus sign", () => {
    expect(toQuoteView({ symbol: "EURUSD", price: 1.16, open: 1.1642, decimals: 5 })).toMatchObject(
      {
        price: "1.16000",
        change: "-0.36%",
        direction: "down",
      },
    );
  });

  it("treats no change as up (+0.00%)", () => {
    expect(toQuoteView({ symbol: "X", price: 2, open: 2, decimals: 2 })).toMatchObject({
      change: "+0.00%",
      direction: "up",
    });
  });
});
