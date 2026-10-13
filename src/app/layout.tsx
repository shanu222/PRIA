import type { Metadata, Viewport } from "next";
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
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>
          <AppShell footer={<Footer />}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
