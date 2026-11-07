import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-jetbrains" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://josh-rochon.vercel.app";
const description = "Senior software engineer in Seattle. Projects, experience and case studies.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Josh Rochon — Senior Software Engineer",
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: "Josh Rochon", description },
  twitter: { card: "summary_large_image", title: "Josh Rochon", description },
};

// Applies a saved theme before first paint so there is no flash (docs/STYLE_GUIDE.md §6).
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
