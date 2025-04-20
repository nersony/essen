import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
