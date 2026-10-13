import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/pria";
import { Providers } from "@/components/layout/Providers";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.shortName} | ${site.organisationShort}`,
    template: `%s · ${site.shortName} | ${site.organisationShort}`,
  },
  description: site.tagline,
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9F8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F0D" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  preload("/pria-intro.mp4", { as: "video", type: "video/mp4" });
  preload("/pria-intro-poster.jpg", { as: "image" });
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="portal-sky" aria-hidden="true">
          <span className="portal-orb portal-orb-a" />
          <span className="portal-orb portal-orb-b" />
          <span className="portal-orb portal-orb-c" />
          <span className="portal-orb portal-orb-d" />
          <span className="portal-grid" />
          <span className="portal-glass" />
          <span className="portal-sheen" />
        </div>
        <Providers>
          <AppShell footer={<Footer />}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
