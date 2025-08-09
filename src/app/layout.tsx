import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Isaac & Lily — June 12, 2026",
  description: "A joyful celebration at Our Lady of Mt. Carmel and Bottleworks Hotel, Indianapolis.",
  icons: {
    icon: [{ url: "/icon.svg" }],
    shortcut: ["/icon.svg"],
    apple: ["/icon.svg"],
  },
  openGraph: {
    title: "Isaac & Lily — June 12, 2026",
    description:
      "A joyful celebration at Our Lady of Mt. Carmel and Bottleworks Hotel, Indianapolis.",
    images: [{ url: "/IMG_1310.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Isaac & Lily — June 12, 2026",
    description:
      "A joyful celebration at Our Lady of Mt. Carmel and Bottleworks Hotel, Indianapolis.",
    images: ["/IMG_1310.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased deco-bg`}>{children}</body>
    </html>
  );
}
