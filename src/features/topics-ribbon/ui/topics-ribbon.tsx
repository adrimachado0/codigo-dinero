import {
  ArrowDownUp,
  Bitcoin,
  CalendarDays,
  ChartCandlestick,
  ChartLine,
  ChartNoAxesCombined,
  ClipboardList,
  Clock,
  Coins,
  Globe,
  NotebookPen,
  Scale,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { Marquee } from "@/shared/ui/marquee";

import { topicsContent, type Topic } from "../content";

const icons: Record<Topic["icon"], LucideIcon> = {
  candlestick: ChartCandlestick,
  levels: ArrowDownUp,
  scale: Scale,
  "stop-loss": ShieldAlert,
  plan: ClipboardList,
  journal: NotebookPen,
  clock: Clock,
  gold: Coins,
  forex: Globe,
  crypto: Bitcoin,
  index: ChartLine,
  risk: ShieldCheck,
  analysis: ChartNoAxesCombined,
  calendar: CalendarDays,
};

/**
 * One ribbon lap. The list is repeated so each half of the marquee is wider than the band
 * (110% of the viewport), which keeps the loop seamless on wide screens.
 */
function Topics({
  items,
  iconSize,
  className,
}: {
  items: Topic[];
  iconSize: number;
  className: string;
}) {
  return [0, 1].flatMap((lap) =>
    items.map((item) => {
      const Icon = icons[item.icon];
      return (
        <span key={`${String(lap)}-${item.label}`} className={cn("flex items-center", className)}>
          <Icon size={iconSize} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
          <span>{item.label}</span>
        </span>
      );
    }),
  );
}

/** Two crossed ribbons sliding in opposite directions: cream (60 s) under red (40 s). */
export function TopicsRibbon() {
  return (
    <section
      aria-label={topicsContent.label}
      className="relative mt-15 h-[220px] overflow-hidden md:mt-22.5"
    >
      <Marquee
        duration={60}
        reverse
        className="absolute top-20.5 -left-[5%] w-[110%] rotate-3 border-y border-ink bg-cream text-ink"
        trackClassName="py-3 text-17 font-medium whitespace-nowrap"
      >
        <Topics items={topicsContent.creamRibbon} iconSize={18} className="gap-2.5 pr-7" />
      </Marquee>
      <Marquee
        duration={40}
        className="absolute top-20 -left-[5%] w-[110%] -rotate-3 bg-accent text-ink"
        trackClassName="py-4 font-display text-22 font-extrabold whitespace-nowrap"
      >
        <Topics items={topicsContent.redRibbon} iconSize={24} className="gap-3 pr-8" />
      </Marquee>
    </section>
  );
}
