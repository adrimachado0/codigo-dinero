import { render } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CandlesIcon,
  CloseIcon,
  InstagramIcon,
  MenuIcon,
  PlayIcon,
  QuoteIcon,
  TelegramIcon,
  TikTokIcon,
  UserIcon,
  XIcon,
  YouTubeIcon,
  type IconProps,
} from "./icons";

// [icon, default size from the reference, stroke width or null for filled icons]
const icons: [string, ComponentType<IconProps>, number, number | null][] = [
  ["ArrowRightIcon", ArrowRightIcon, 18, 1.8],
  ["ArrowLeftIcon", ArrowLeftIcon, 18, 1.8],
  ["ArrowUpRightIcon", ArrowUpRightIcon, 22, 1.8],
  ["MenuIcon", MenuIcon, 18, 2],
  ["CloseIcon", CloseIcon, 18, 2],
  ["UserIcon", UserIcon, 22, 1.8],
  ["CandlesIcon", CandlesIcon, 64, 2.4],
  ["YouTubeIcon", YouTubeIcon, 20, 1.7],
  ["InstagramIcon", InstagramIcon, 20, 1.7],
  ["TikTokIcon", TikTokIcon, 20, 1.7],
  ["TelegramIcon", TelegramIcon, 20, 1.7],
  ["XIcon", XIcon, 18, 1.7],
  ["PlayIcon", PlayIcon, 22, null],
  ["QuoteIcon", QuoteIcon, 28, null],
];

describe.each(icons)("%s", (_name, Icon, size, strokeWidth) => {
  it("is decorative and uses the reference defaults", () => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", String(size));
    expect(svg).toHaveAttribute("height", String(size));
    if (strokeWidth === null) {
      expect(svg).toHaveAttribute("fill", "currentColor");
    } else {
      expect(svg).toHaveAttribute("stroke", "currentColor");
      expect(svg).toHaveAttribute("stroke-width", String(strokeWidth));
    }
  });

  it("accepts a custom size", () => {
    const { container } = render(<Icon size={40} />);

    expect(container.querySelector("svg")).toHaveAttribute("width", "40");
  });
});
