import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Source_Sans_3, Spectral } from "next/font/google";
import { CascadeGuard, CascadePlan } from "@/components/cascade/Cascade";
import Loaded from "@/components/scroll/Loaded";
import "./tokens.css";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  // 200 for display, 300 for titles and the subtitle. Every weight listed
  // here is preloaded.
  weight: ["200", "300"],
  display: "swap",
});

// 400 for the names in an employer's grid (components/work/WorkCell). Not
// preloaded: nothing above the fold is 400.
const spectralRegular = Spectral({
  variable: "--font-spectral-regular",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

// Italic 200 and 300 only. Not preloaded: nothing above the fold is italic.
const spectralItalic = Spectral({
  variable: "--font-spectral-italic",
  subsets: ["latin"],
  weight: ["200", "300"],
  style: "italic",
  display: "swap",
  preload: false,
});

// Running text. 400 for paragraphs, 600 for links inside them
// (components/text-link). The fallback is next/font's: Arial resized to
// Source Sans 3's metrics, so nothing moves on swap.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  adjustFontFallback: true,
});

// Italic 400 only, for emphasis in running text. Not preloaded.
const sourceSansItalic = Source_Sans_3({
  variable: "--font-source-sans-italic",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scottbarclay.dev"),
  title: {
    default: "Scott Barclay · Software engineer",
    template: "%s · Scott Barclay",
  },
  description:
    "Software engineer. Trading desk tools, a marketplace Chrome extension, and an iOS app designed, built, and shipped alone.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    siteName: "Scott Barclay",
    type: "website",
    locale: "en_US",
  },
  // The image comes from app/opengraph-image.tsx (and a project page's own).
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E1512",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The load cascade's first script marks <html> before React hydrates it.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spectral.variable} ${spectralRegular.variable} ${spectralItalic.variable} ${sourceSans.variable} ${sourceSansItalic.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <CascadeGuard />
      </head>
      <body>
        <Loaded />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {children}
        <CascadePlan />
      </body>
    </html>
  );
}
