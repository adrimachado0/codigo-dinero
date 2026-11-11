import { cn } from "@/shared/lib/cn";

import type { LibraryItem } from "../content";

const toneColor = { accent: "#FF2B2B", gold: "#D9A94A" } as const;

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
