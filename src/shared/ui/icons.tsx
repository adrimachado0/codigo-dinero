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

export function ChevronDownIcon({ size = 16, strokeWidth = 2, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M6 9l6 6 6-6" />
    </StrokeIcon>
  );
}

/** Audience cards ("¿A quién está dirigido?"): steps up for beginners. */
export function StepsUpIcon({ size = 52, strokeWidth = 2.4, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} viewBox="0 0 48 48" strokeWidth={strokeWidth} {...props}>
      <path d="M6 40h10v-9h10v-9h10v-9h6" />
      <path d="M36 7l6 6-6 6" />
    </StrokeIcon>
  );
}

/** Audience cards: rising chart for experienced traders. */
export function TrendUpIcon({ size = 52, strokeWidth = 2.4, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} viewBox="0 0 48 48" strokeWidth={strokeWidth} {...props}>
      <path d="M6 42h36" />
      <path d="M8 34l10-10 8 6 14-16" />
      <path d="M32 14h8v8" />
    </StrokeIcon>
  );
}

/** Audience cards: a leader and their community. */
export function CommunityIcon({ size = 52, strokeWidth = 2.4, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} viewBox="0 0 48 48" strokeWidth={strokeWidth} {...props}>
      <circle cx="24" cy="14" r="5" />
      <circle cx="10" cy="32" r="4.5" />
      <circle cx="38" cy="32" r="4.5" />
      <path d="M24 19v8M24 27l-11 3M24 27l11 3" />
      <path d="M3 44c1-4 4-6 7-6s6 2 7 6M31 44c1-4 4-6 7-6s6 2 7 6" />
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

/** Chat bubble with a handset: every button that opens WhatsApp. */
export function WhatsAppIcon({ size = 20, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <StrokeIcon size={size} strokeWidth={strokeWidth} {...props}>
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />
      <path d="M9.3 8.3c.3-.4.7-.4 1 0l.8 1.3c.2.3.1.7-.1.9l-.5.5c.6 1.3 1.6 2.3 2.9 2.9l.5-.5c.2-.2.6-.3.9-.1l1.3.8c.4.3.4.7 0 1-.8.8-2 1.1-3 .7a8.3 8.3 0 0 1-4.5-4.5c-.4-1-.1-2.2.7-3z" />
    </StrokeIcon>
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
