import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Ubuntu_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { themeScript } from "@/components/theme-script";
import { fr } from "@/content/fr";

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-ubuntu-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE = "https://yoonpay.benhattab.pro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: fr.meta.title,
  description: fr.meta.description,
  alternates: {
    canonical: "/fr/",
    languages: { en: "/", fr: "/fr/" },
  },
  openGraph: {
    type: "website",
    siteName: "Yoon",
    title: fr.meta.title,
    description: fr.meta.description,
    url: "/fr/",
    locale: "fr_FR",
    images: [
      {
        url: "/brand/social-preview.png",
        width: 1280,
        height: 640,
        alt: "Yoon — le Y est une route qui se sépare en deux.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: fr.meta.title,
    description: fr.meta.description,
    images: ["/brand/social-preview.png"],
  },
  icons: { icon: "/brand/icon.svg" },
};

export default function FrenchLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${ubuntuSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
