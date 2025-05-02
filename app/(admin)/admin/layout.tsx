// app/admin/layout.tsx
import type React from "react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Home,
  LogOut,
  Users,
  Activity,
  Package,
  FolderTree,
} from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get session for display purposes
  const session = await getServerSession(authOptions)

  // This check is now redundant with the middleware, but keeping it as a fallback
  // The middleware should have already redirected unauthenticated users
  if (!session || !session.user) {
    redirect("/admin/login")
  }

  // Check if user is super admin
  const isSuperAdmin = session.user.role === "super_admin"
  const isAdmin = session.user.role === "admin" || isSuperAdmin

  // This check is also redundant with the middleware, but keeping as a fallback
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-secondary p-6 hidden md:block">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ESSEN Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Logged in as {session.user.name}</p>
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <FolderTree className="mr-2 h-4 w-4" />
            Categories
          </Link>
          {/* <Link
            href="/admin/orders"
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Package className="mr-2 h-4 w-4" />
            Orders
          </Link> */}
          {isAdmin && (
            <Link
              href="/admin/users"
              className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Link>
          )}
          {isSuperAdmin && (
            <Link
              href="/admin/logs"
              className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Activity className="mr-2 h-4 w-4" />
              Activity Logs
            </Link>
          )}
          {/* <Link
            href="/admin/settings"
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link> */}
        </nav>
        {/* <div className="mt-auto pt-6 border-t mt-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Back to Website
          </Link>
          <Link
            href="/api/auth/signout"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center mt-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-background border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold md:hidden">ESSEN Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{session.user.email}</span>
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
