import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if the user is authenticated
  const session = await getServerSession(authOptions)

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/admin/login")
  }

  // If we get here, the user is authenticated
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-secondary p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ESSEN Admin</h1>
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="block px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/admin/settings"
            className="block px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t mt-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Website
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-background border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold md:hidden">ESSEN Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{session?.user?.email || "Admin User"}</span>
              <Link href="/api/auth/signout" className="text-sm text-primary hover:text-primary/80">
                Sign Out
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
