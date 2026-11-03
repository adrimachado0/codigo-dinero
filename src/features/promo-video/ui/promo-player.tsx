"use client";

import { Player } from "@remotion/player";

import { PROMO_COMPOSITION, PromoCodigoDinero } from "../remotion/promo-codigo-dinero";

/** Loaded on demand (next/dynamic, ssr: false) when the user presses play. */
export default function PromoPlayer({ title }: { title: string }) {
  return (
    // The Player doesn't forward ARIA props: the named region wraps it.
    <div role="region" aria-label={title} className="absolute inset-0">
      <Player
        component={PromoCodigoDinero}
        durationInFrames={PROMO_COMPOSITION.durationInFrames}
        fps={PROMO_COMPOSITION.fps}
        compositionWidth={PROMO_COMPOSITION.width}
        compositionHeight={PROMO_COMPOSITION.height}
        controls
        autoPlay
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
