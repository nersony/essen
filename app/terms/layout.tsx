import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions | ESSEN",
  description: "Terms, conditions, and policies for ESSEN furniture store",
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
