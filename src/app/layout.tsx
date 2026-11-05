import { cn } from "@/shared/lib/cn";
import { buildRootMetadata, rootViewport } from "@/shared/seo/metadata";
import { lexend, unbounded } from "@/shared/ui/fonts";
import "./globals.css";

export const metadata = buildRootMetadata();
export const viewport = rootViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn(lexend.variable, unbounded.variable)}>
      <body>
        <div className="relative min-h-screen overflow-x-clip bg-canvas font-sans text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
