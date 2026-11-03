import type { ReactNode, SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

type BaseIconProps = IconProps & { viewBox?: string; children: ReactNode };

/** Decorative by default (aria-hidden); the accessible name goes on the parent control. */
function StrokeIcon({
  size = 24,
  viewBox = "0 0 24 24",
  strokeWidth,
  children,
  ...props
}: BaseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

function FillIcon({ size = 24, viewBox = "0 0 24 24", children, ...props }: BaseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, strokeWidth = 1.8, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </StrokeIcon>
  );
}

export function ArrowLeftIcon({ size = 18, strokeWidth = 1.8, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </StrokeIcon>
  );
}

export function ArrowUpRightIcon({ size = 22, strokeWidth = 1.8, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </StrokeIcon>
  );
}

export function MenuIcon({ size = 18, strokeWidth = 2, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </StrokeIcon>
  );
}

export function CloseIcon({ size = 18, strokeWidth = 2, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </StrokeIcon>
  );
}

export function UserIcon({ size = 22, strokeWidth = 1.8, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5c.9-3.9 3.9-6 7.5-6s6.6 2.1 7.5 6" />
    </StrokeIcon>
  );
}

/** Candlestick bars of the mentor card. */
export function CandlesIcon({ size = 64, strokeWidth = 2.4, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} viewBox="0 0 64 64" strokeWidth={strokeWidth} {...props}>
      <path d="M14 18v8M14 46v6M32 10v10M32 40v12M50 22v6M50 44v8" />
      <rect x="9" y="26" width="10" height="20" rx="2" />
      <rect x="27" y="20" width="10" height="20" rx="2" />
      <rect x="45" y="28" width="10" height="16" rx="2" />
    </StrokeIcon>
  );
}

export function PlayIcon({ size = 22, ...props }: IconProps) {
  return (
    <FillIcon size={size} {...props}>
      <path d="M8 5.5v13l11-6.5z" />
    </FillIcon>
  );
}

export function QuoteIcon({ size = 28, ...props }: IconProps) {
  return (
    <FillIcon size={size} {...props}>
      <path d="M4 7h6v6c0 3.5-2 5.5-5 6.5l-.8-1.6c1.7-.8 2.6-2 2.8-3.9H4zM14 7h6v6c0 3.5-2 5.5-5 6.5l-.8-1.6c1.7-.8 2.6-2 2.8-3.9H14z" />
    </FillIcon>
  );
}

export function YouTubeIcon({ size = 20, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" />
    </StrokeIcon>
  );
}

export function InstagramIcon({ size = 20, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" />
    </StrokeIcon>
  );
}

export function TikTokIcon({ size = 20, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M14 3.5v11a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3.5c.5 2.6 2.4 4.3 5 4.5" />
    </StrokeIcon>
  );
}

export function TelegramIcon({ size = 20, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M21.5 4L2.5 11.3l6.5 2.3 2.4 6.4 3.4-4.3 4.9 3.7z" />
      <path d="M9 13.6L21.5 4" />
    </StrokeIcon>
  );
}

export function XIcon({ size = 18, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M4 4h4.5L20 20h-4.5z" />
      <path d="M20 4l-6.6 7.3M10.6 12.7L4 20" />
    </StrokeIcon>
  );
}
