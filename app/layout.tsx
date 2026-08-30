import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import ToasterProvider from "@/components/providers/ToasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linkits — Curated Developer Tools & Resources",
    template: "%s | Linkits",
  },
  description:
    "Discover, save, and organize the best developer tools, resources, and platforms. Linkits is your personal toolbox for building and growing projects.",
  keywords: [
    "link manager",
    "bookmark manager",
    "save links",
    "developer tools",
    "private link catalogue",
    "useful links",
    "tech resources",
    "AI tools",
    "developer resources",
    "tool directory",
  ],
  authors: [{ name: "Linkits" }],
  creator: "Linkits",
  openGraph: {
    title: "Linkits — Curated Developer Tools & Resources",
    description:
      "Discover, save, and organize the best developer tools, resources, and platforms.",
    url: siteUrl,
    siteName: "Linkits",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Linkits - Curated Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkits — Curated Developer Tools & Resources",
    description:
      "Discover, save, and organize the best developer tools, resources, and platforms.",
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "jNxotQjuTrJu7NBPzncRXBrOMu2eXioSpqbi-69JGIk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <ThemeProvider>
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
