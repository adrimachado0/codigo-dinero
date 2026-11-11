import { cn } from "@/shared/lib/cn";
import { Logo } from "@/shared/ui/logo";

import type { LibraryItem } from "../content";

const toneColor = { accent: "#FF2B2B", gold: "#D9A94A" } as const;

/** Cover of the book, slightly rotated over the wine circle. */
export function BookCover({
  cover,
}: {
  cover: { label: string; author: string; title: string; subtitle: string };
}) {
  return (
    <div
      role="img"
      aria-label={cover.label}
      className="relative box-border flex aspect-[2/3] w-[270px] max-w-[78%] -rotate-3 flex-col overflow-hidden rounded-[6px_16px_16px_6px] bg-[#121212] pt-6.5 pr-5.5 pb-5.5 pl-9.5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
    >
      <div className="absolute inset-y-0 left-0 w-4 border-r border-gold/55 bg-[#0a0a0a]" />
      <span className="text-10 font-semibold tracking-[0.22em] text-gold uppercase">
        {cover.author}
      </span>
      <span className="mt-5.5 font-display text-[21px] leading-compact font-extrabold text-white">
        {cover.title}
      </span>
      <span className="mt-3.5 h-1 w-10 bg-accent" />
      <span className="mt-3 text-13 text-fg-soft">{cover.subtitle}</span>
      <div className="flex flex-auto items-center">
        <svg
          viewBox="0 0 200 120"
          aria-hidden="true"
          focusable="false"
          className="block h-auto w-full"
        >
          <rect
            x="104"
            y="70"
            width="96"
            height="16"
            fill="#D9A94A"
            fillOpacity="0.22"
            stroke="#D9A94A"
            strokeOpacity="0.7"
          />
          <path
            d="M4 96L30 60L48 78L76 36L96 58L112 76L140 24L158 44L196 10"
            fill="none"
            stroke="#FF2B2B"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path d="M76 36H150" stroke="#FFFFFF" strokeOpacity="0.6" strokeDasharray="4 4" />
          <text
            x="112"
            y="31"
            fill="#FFFFFF"
            fillOpacity="0.7"
            fontSize="9"
            letterSpacing="1"
            className="font-sans"
          >
            BOS
          </text>
        </svg>
      </div>
      <Logo height={28} className="self-start" />
    </div>
  );
}

/** Drawing in the middle of a library cover. */
function Motif({ motif, color }: { motif: LibraryItem["motif"]; color: string }) {
  const svgProps = {
    viewBox: "0 0 100 60",
    "aria-hidden": true,
    focusable: false,
    className: "h-auto w-full",
  } as const;
  if (motif === "candles") {
    return (
      <svg {...svgProps}>
        <g stroke={color} strokeWidth="2">
          <line x1="12" y1="34" x2="12" y2="54" />
          <rect x="8" y="38" width="8" height="12" fill={color} />
          <line x1="30" y1="26" x2="30" y2="48" />
          <rect x="26" y="30" width="8" height="14" fill={color} />
          <line x1="48" y1="30" x2="48" y2="50" />
          <rect x="44" y="33" width="8" height="12" fill="none" />
          <line x1="66" y1="14" x2="66" y2="38" />
          <rect x="62" y="18" width="8" height="15" fill={color} />
          <line x1="84" y1="6" x2="84" y2="28" />
          <rect x="80" y="9" width="8" height="14" fill={color} />
        </g>
      </svg>
    );
  }
  if (motif === "zone") {
    return (
      <svg {...svgProps}>
        <rect x="50" y="36" width="50" height="12" fill={color} fillOpacity="0.25" stroke={color} />
        <path
          d="M2 52L20 30L32 42L50 16L62 30L74 44L98 6"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.8"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg {...svgProps}>
      <path d="M0 44H100M0 26H100" stroke={color} strokeDasharray="4 4" />
      <path
        d="M2 50C20 50 24 18 44 22S70 44 98 10"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.8"
        strokeWidth="2"
      />
      <circle cx="44" cy="22" r="3" fill={color} />
    </svg>
  );
}

/** Example cover of the library grid (placeholder until the real ones). */
export function LibraryCover({ item }: { item: LibraryItem }) {
  const color = toneColor[item.tone];
  return (
    <div className="relative box-border flex aspect-[3/4] flex-col overflow-hidden rounded-[6px_14px_14px_6px] border border-white/8 bg-surface-100 pt-4 pr-3.5 pb-3.5 pl-5.5">
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-2",
          item.tone === "accent" ? "bg-accent" : "bg-gold",
        )}
      />
      <span
        className={cn(
          "text-10 font-semibold tracking-caps-lg uppercase",
          item.tone === "accent" ? "text-accent" : "text-gold",
        )}
      >
        {item.kind}
      </span>
      <span className="mt-2.5 text-14 leading-[1.25] font-semibold text-white">{item.title}</span>
      <div className="flex flex-auto items-center justify-center py-2.5">
        <Motif motif={item.motif} color={color} />
      </div>
      <span className="font-display text-[9px] font-semibold tracking-caps-md text-placeholder">
        CÓDIGO DINERO
      </span>
    </div>
  );
}
