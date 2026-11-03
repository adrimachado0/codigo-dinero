import type { Metadata } from "next";

import { cn } from "@/shared/lib/cn";
import { lexend, unbounded } from "@/shared/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Código Dinero · Academia de trading",
    template: "%s · Código Dinero",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn(lexend.variable, unbounded.variable)}>
      <body>
        <div className="relative min-h-screen overflow-x-hidden bg-canvas font-sans text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
