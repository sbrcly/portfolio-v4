import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Spectral } from "next/font/google";
import "./tokens.css";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
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
};

export const viewport: Viewport = {
  themeColor: "#121A16",
};

// Runs before first paint. The entrance plays only on the first page load of
// a session, and only when that load is the home page.
const entranceScript = `(function(){var s=false;try{s=sessionStorage.getItem("sb-vigil-entrance")==="1";sessionStorage.setItem("sb-vigil-entrance","1")}catch(e){}document.documentElement.dataset.entrance=!s&&location.pathname==="/"?"play":"skip"})()`;

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
      </head>
      <body>{children}</body>
    </html>
  );
}
