import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/session-provider"
import { CartProvider } from "@/context/cart-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

// Define site metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://essen.sg"),
  title: {
    default: "ESSEN | Your Essential Living Expert in Singapore",
    template: "%s | ESSEN Singapore",
  },
  description:
    "Premium furniture store in Singapore offering stylish, high-quality furniture for modern living spaces. Visit our showroom for exclusive in-store offers.",
  keywords: [
    "furniture",
    "Singapore",
    "home decor",
    "living room",
    "dining",
    "bedroom",
    "office furniture",
    "premium furniture",
  ],
  authors: [{ name: "ESSEN Singapore" }],
  creator: "ESSEN Singapore",
  publisher: "ESSEN Singapore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://essen.sg",
    siteName: "ESSEN Singapore",
    title: "ESSEN | Your Essential Living Expert in Singapore",
    description:
      "Premium furniture store in Singapore offering stylish, high-quality furniture for modern living spaces.",
    images: [
      {
        url: "/images/essen-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ESSEN Singapore - Premium Furniture Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESSEN | Your Essential Living Expert in Singapore",
    description:
      "Premium furniture store in Singapore offering stylish, high-quality furniture for modern living spaces.",
    images: ["/images/essen-twitter-image.jpg"],
    creator: "@essen_sg",
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code
  },
  alternates: {
    canonical: "https://essen.sg",
    languages: {
      "en-SG": "https://essen.sg",
    },
  },
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} font-sans`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}