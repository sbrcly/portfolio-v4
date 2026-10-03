import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Spectral } from "next/font/google";
import "./tokens.css";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  // 200 for display, 300 for text. 400 is in the design's type system but
  // nothing uses it, and every weight listed here is preloaded.
  weight: ["200", "300"],
  display: "swap",
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
  // The image comes from app/opengraph-image.tsx (and the Prava route's own).
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#121A16",
};

// Runs before first paint. The entrance plays only on the first page load of
// a session, and only when that load is the home page. Without session
// storage there is no way to play it once, so it does not play.
const entranceScript = `(function(){var s=true;try{s=sessionStorage.getItem("sb-vigil-entrance")==="1";sessionStorage.setItem("sb-vigil-entrance","1")}catch(e){s=true}document.documentElement.dataset.entrance=!s&&location.pathname==="/"?"play":"skip"})()`;

// Marks the page loaded, which turns smooth scrolling on from 960px up
// (globals.css): until then a chapter in the URL is landed on, not scrolled to.
const loadedScript = `addEventListener("load",function(){requestAnimationFrame(function(){document.documentElement.dataset.loaded=""})})`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spectral.variable} ${spectralItalic.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: entranceScript }} />
        <script dangerouslySetInnerHTML={{ __html: loadedScript }} />
      </head>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
