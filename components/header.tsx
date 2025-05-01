"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Menu, Phone } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-full bg-primary h-4"></div>
      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              }}
            >
              <div style={{ width: "180px", height: "48px", position: "relative" }}>
                <Image
                  src="/images/essen-header-logo.png"
                  alt="ESSEN - Your Essential Living Expert"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  unoptimized
                />
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" className="uppercase text-sm font-medium px-4">
                      HOME
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/products" className="uppercase text-sm font-medium px-4">
                      FURNITURE
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/visit-us" className="uppercase text-sm font-medium px-4">
                      VISIT US
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about-us" className="uppercase text-sm font-medium px-4">
                      ABOUT US
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/contact" className="uppercase text-sm font-medium px-4">
                      CONTACT
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Cart Icon */}

            <Link
              href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
              className="hidden md:flex"
            >
              <Button variant="outline" size="sm" className="ml-2">
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                    HOME
                  </Link>
                  <Link href="/products" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                    FURNITURE
                  </Link>
                  <Link href="/visit-us" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                    VISIT US
                  </Link>
                  <Link href="/about-us" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                    ABOUT US
                  </Link>
                  <Link href="/contact" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                    CONTACT
                  </Link>
                  <Link
                    href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                    className="mt-4"
                    onClick={() => setOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      WhatsApp Chat
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
    </>
  )
}
