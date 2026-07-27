import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Schibsted_Grotesk } from "next/font/google";
import MainNav from "@/components/main-nav/MainNav";
import Footer from "@/components/footer/Footer";
import Lamplight from "@/components/lamplight/Lamplight";
import ScrollReveal from "@/components/scroll-reveal/ScrollReveal";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scottbarclay.dev"),
  title: {
    default: "Scott Barclay · Software engineer & founder",
    template: "%s · Scott Barclay",
  },
  description:
    "Software engineer and founder. Most recently: Prava, an AI faith journal for iOS. Designed, built, and shipped solo, from first commit to the App Store.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    siteName: "Scott Barclay",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <Lamplight />
        <ScrollReveal />
        <div className="siteFrame">
          <MainNav />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
