"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { Maximize, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PROMO_COMPOSITION, PromoCodigoDinero } from "../remotion/promo-codigo-dinero";

type Labels = {
  playerTitle: string;
  playLabel: string;
  pauseLabel: string;
  seekLabel: string;
  fullscreenLabel: string;
};

const { fps, durationInFrames } = PROMO_COMPOSITION;

const formatTime = (frame: number) => {
  const seconds = Math.floor(frame / fps);
  return `${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, "0")}`;
};

/**
 * Loaded on demand (next/dynamic, ssr: false) when the user presses play.
 * Custom controls in the site's style (red/ink pills) instead of Remotion's default bar.
 */
export default function PromoPlayer({ labels }: { labels: Labels }) {
  const playerRef = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onPlay = () => {
      setPlaying(true);
    };
    const onPause = () => {
      setPlaying(false);
    };
    const onFrame = (event: { detail: { frame: number } }) => {
      setFrame(event.detail.frame);
    };
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onPause);
    player.addEventListener("frameupdate", onFrame);
    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onPause);
      player.removeEventListener("frameupdate", onFrame);
    };
  }, []);

  const progress = (frame / (durationInFrames - 1)) * 100;

  return (
    // The Player doesn't forward ARIA props: the named region wraps it.
    <div role="region" aria-label={labels.playerTitle} className="group absolute inset-0">
      <Player
        ref={playerRef}
        component={PromoCodigoDinero}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={PROMO_COMPOSITION.width}
        compositionHeight={PROMO_COMPOSITION.height}
        autoPlay
        clickToPlay
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
      <div className="backdrop-blur-sm absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-full bg-ink/86 p-1.5 pr-4">
        <button
          type="button"
          aria-label={playing ? labels.pauseLabel : labels.playLabel}
          onClick={() => {
            if (frame >= durationInFrames - 1) playerRef.current?.seekTo(0);
            playerRef.current?.toggle();
          }}
          className="flex size-10 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-accent p-0 text-ink transition-[background-color,scale] duration-200 hover:scale-105 hover:bg-white"
        >
          {playing ? (
            <Pause size={18} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={18} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={durationInFrames - 1}
          value={frame}
          aria-label={labels.seekLabel}
          aria-valuetext={`${formatTime(frame)} de ${formatTime(durationInFrames)}`}
          onChange={(event) => {
            playerRef.current?.seekTo(Number(event.currentTarget.value));
          }}
          style={{
            background: `linear-gradient(to right, #FF2B2B ${String(progress)}%, rgba(255,255,255,0.18) ${String(progress)}%)`,
          }}
          className="h-1.5 min-w-0 flex-auto cursor-pointer appearance-none rounded-full accent-accent"
        />
        <span className="flex-none text-12 text-fg-soft tabular-nums">
          {formatTime(frame)} / {formatTime(durationInFrames)}
        </span>
        <button
          type="button"
          aria-label={labels.fullscreenLabel}
          onClick={() => {
            playerRef.current?.requestFullscreen();
          }}
          className="flex size-8 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-white transition-colors duration-200 hover:text-accent"
        >
          <Maximize size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
