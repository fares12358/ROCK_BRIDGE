import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageProvider from "./providers/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  // 🔹 Basic SEO
  title: {
    default: "ROCK BRIDGE | Import & Export Solutions",
    template: "%s | ROCK BRIDGE",
  },
  description:
    "ROCK BRIDGE provides world-class import, export, and commercial mediation services with reliability, transparency, and speed. We connect your business to global markets with confidence.",

  // 🔹 Author & Publisher Info
  authors: [{ name: "ROCK BRIDGE", url: "https://rock-bridge.vercel.app" }],
  creator: "ROCK BRIDGE Team",
  publisher: "ROCK BRIDGE",
  keywords: [
    "ROCK BRIDGE",
    "Import and Export",
    "Commercial Mediation",
    "Trade Services",
    "Saudi Arabia",
    "Business Logistics",
    "Global Trade",
    "Shipping",
    "Procurement",
    "Inspection Services",
  ],

  // 🔹 Open Graph (for social media previews)
  openGraph: {
    title: "ROCK BRIDGE – Import & Export Solutions",
    description:
      "Connecting your business to the world through reliable import, export, and mediation services from Saudi Arabia.",
    url: "https://rock-bridge.vercel.app",
    siteName: "ROCK BRIDGE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "ROCK BRIDGE - Import & Export Solutions",
      },
    ],
  },

  // 🔹 Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "ROCK BRIDGE – Import & Export Solutions",
    description:
      "Reliable import, export, and commercial mediation services – connecting your business to global markets.",
    creator: "@rockbridge_sa",
    images: ["/images/logo.png"],
  },

  // 🔹 Robots & Canonical
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://rock-bridge.vercel.app",
  },

  // 🔹 Theme and viewport
  themeColor: "#9d1e17",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },

  // 🔹 Misc
  metadataBase: new URL("https://rock-bridge.vercel.app"),
  category: "Business & Trade",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
