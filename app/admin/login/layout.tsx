import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if user is already authenticated
  const session = await getServerSession(authOptions)

  // If already authenticated, redirect to admin dashboard
  if (session) {
    redirect("/admin")
  }

  return <>{children}</>
}
