import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | ESSEN Singapore",
    default: "Terms and Policies | ESSEN Singapore",
  },
  description:
    "Terms, conditions, and policies for ESSEN furniture store in Singapore. Information about warranties, delivery, returns, and more.",
  alternates: {
    canonical: "https://essen.sg/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  )
}
