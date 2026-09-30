import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Ubuntu_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { themeScript } from "@/components/theme-script";
import { en } from "@/content/en";

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
  title: en.meta.title,
  description: en.meta.description,
  alternates: {
    canonical: "/",
    languages: { en: "/", fr: "/fr/" },
  },
  openGraph: {
    type: "website",
    siteName: "Yoon",
    title: en.meta.title,
    description: en.meta.description,
    url: "/",
    locale: "en",
    images: [
      {
        url: "/brand/social-preview.png",
        width: 1280,
        height: 640,
        alt: "Yoon — the Y is a road forking in two.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
    images: ["/brand/social-preview.png"],
  },
  icons: { icon: "/brand/icon.svg" },
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
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
