"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { Maximize, Pause, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { PlayIcon } from "@/shared/ui/icons";

import { CandlesExplainer } from "../video/candles-explainer";
import { CANDLES_VIDEO } from "../video/theme";

export type PlayerLabels = {
  playerTitle: string;
  playLabel: string;
  pauseLabel: string;
  replayLabel: string;
  seekLabel: string;
  fullscreenLabel: string;
};

const { fps, durationInFrames, width, height } = CANDLES_VIDEO;
const LAST_FRAME = durationInFrames - 1;
/** Frame shown before playing: the title card, fully drawn. */
const POSTER_FRAME = 45;
/** While playing, the control bar hides after this long without pointer or keyboard activity. */
const IDLE_MS = 2200;

const formatTime = (frame: number) => {
  const seconds = Math.floor(frame / fps);
  return `${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, "0")}`;
};

type Status = "poster" | "playing" | "paused" | "ended";

/**
 * Loaded on demand (next/dynamic, ssr: false) when the video frame nears the viewport.
 * Custom controls in the site's style (red and ink pills) instead of Remotion's default bar.
 */
export default function CandlesPlayer({ labels }: { labels: PlayerLabels }) {
  const playerRef = useRef<PlayerRef>(null);
  const [status, setStatus] = useState<Status>("poster");
  const [frame, setFrame] = useState(POSTER_FRAME);
  const [active, setActive] = useState(true);
  const idleTimer = useRef<number | undefined>(undefined);

  /** Shows the control bar and restarts the countdown to hide it. */
  const wake = useCallback(() => {
    setActive(true);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      setActive(false);
    }, IDLE_MS);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(idleTimer.current);
    },
    [],
  );

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onPlay = () => {
      setStatus("playing");
      wake();
    };
    const onPause = () => {
      setStatus((current) => (current === "ended" ? current : "paused"));
    };
    const onEnded = () => {
      setStatus("ended");
    };
    const onFrame = (event: { detail: { frame: number } }) => {
      setFrame(event.detail.frame);
    };
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onEnded);
    player.addEventListener("frameupdate", onFrame);
    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("frameupdate", onFrame);
    };
  }, [wake]);

  const toggle = () => {
    const player = playerRef.current;
    if (!player) return;
    if (status === "playing") {
      player.pause();
      return;
    }
    // From the poster or the end, start over.
    if (status === "poster" || status === "ended") player.seekTo(0);
    player.play();
  };

  const progress = (frame / LAST_FRAME) * 100;
  const barHidden = status === "playing" && !active;
  // Before the first play the big button is enough; the bar would cover the title card.
  const barGone = status === "poster";

  return (
    // The Player doesn't forward ARIA props: the named region wraps it.
    <div
      role="region"
      aria-label={labels.playerTitle}
      onPointerMove={wake}
      onFocus={wake}
      className={cn("absolute inset-0", barHidden && "cursor-none")}
    >
      <Player
        ref={playerRef}
        component={CandlesExplainer}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        initialFrame={POSTER_FRAME}
        clickToPlay={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
      {/* Big button: on the empty top right of the title card, centered on the last frame. */}
      {(status === "poster" || status === "ended") && (
        <button
          type="button"
          aria-label={status === "ended" ? labels.replayLabel : labels.playLabel}
          onClick={toggle}
          className={cn(
            "absolute flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-accent p-0 text-ink shadow-[0_0_0_10px_rgba(255,43,43,0.25)] transition-[scale,background-color] duration-300 hover:scale-110 hover:bg-white md:size-17.5",
            status === "poster" ? "top-[28%] left-[78%]" : "top-[42%] left-1/2",
          )}
        >
          {status === "ended" ? <RotateCcw size={24} aria-hidden="true" /> : <PlayIcon size={24} />}
        </button>
      )}
      <div
        className={cn(
          "absolute right-2.5 bottom-2.5 left-2.5 flex items-center gap-2 rounded-full bg-ink/86 p-1 pr-2.5 transition-[opacity,translate] duration-300 md:right-4 md:bottom-4 md:left-4 md:gap-3 md:p-1.5 md:pr-4",
          barHidden && "pointer-events-none translate-y-2 opacity-0",
          barGone && "hidden",
        )}
      >
        <button
          type="button"
          aria-label={status === "playing" ? labels.pauseLabel : labels.playLabel}
          onClick={toggle}
          className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-accent p-0 text-ink transition-[background-color,scale] duration-200 hover:scale-105 hover:bg-white"
        >
          {status === "playing" ? (
            <Pause size={18} fill="currentColor" aria-hidden="true" />
          ) : (
            <PlayIcon size={18} />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={LAST_FRAME}
          value={frame}
          aria-label={labels.seekLabel}
          aria-valuetext={`${formatTime(frame)} de ${formatTime(durationInFrames)}`}
          onChange={(event) => {
            if (status === "poster") setStatus("paused");
            playerRef.current?.seekTo(Number(event.currentTarget.value));
          }}
          style={{
            background: `linear-gradient(to right, #FF2B2B ${String(progress)}%, rgba(255,255,255,0.18) ${String(progress)}%)`,
          }}
          className="h-1.5 min-w-0 flex-auto cursor-pointer appearance-none rounded-full accent-accent"
        />
        <span className="flex-none text-12 text-fg-soft tabular-nums max-md:hidden">
          {formatTime(frame)} / {formatTime(durationInFrames)}
        </span>
        <button
          type="button"
          aria-label={labels.fullscreenLabel}
          onClick={() => {
            playerRef.current?.requestFullscreen();
          }}
          className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-white transition-colors duration-200 hover:text-accent"
        >
          <Maximize size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
