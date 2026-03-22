import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

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
  title: "Linkits",
  description:
    "A simple platform to save useful links in one place and build your own private link catalogue for future reference.",
  keywords: [
    "link manager",
    "bookmark manager",
    "save links",
    "developer tools",
    "private link catalogue",
    "useful links",
    "tech resources",
  ],
  openGraph: {
    title: "Linkits",
    description:
      "Save useful links in one place and build your own private link catalogue for future reference.",
    url: siteUrl,
    siteName: "Linkits",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkits",
    description:
      "Save useful links in one place and build your own private link catalogue for future reference.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}  antialiased`}
      >
        <SessionProviderWrapper>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
