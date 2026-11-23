import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { MotionPrefsProvider } from "@/components/providers/MotionPrefs";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { Chrome } from "@/components/chrome/Chrome";
import { Cursor } from "@/components/chrome/Cursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.bio,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.statement,
    images: ["/work/lapor-pak/01.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}>
      <body>
        <MotionPrefsProvider>
          <SmoothScroll>
            <TransitionProvider>
              <Chrome />
              <main id="main">{children}</main>
              <Cursor />
              <div className="grain" aria-hidden />
            </TransitionProvider>
          </SmoothScroll>
        </MotionPrefsProvider>
      </body>
    </html>
  );
}
