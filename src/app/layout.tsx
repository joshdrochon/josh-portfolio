import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { themeScript } from "@/lib/theme-script";
import { SoundProvider } from "@/providers/SoundProvider";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-jetbrains" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joshrochon.com";
const description = "Senior software engineer in Seattle. Projects, experience and case studies.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Josh Rochon — Senior Software Engineer",
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: "Josh Rochon", description },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SoundProvider>{children}</SoundProvider>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
