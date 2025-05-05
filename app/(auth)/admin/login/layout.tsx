// app/admin/login/layout.tsx
import type React from "react"

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Return just the children without any sidebar or header
  return (
    <div className="min-h-screen bg-secondary">
      {children}
    </div>
  )
}