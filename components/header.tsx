"use client"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Menu, Phone } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TrackClick } from "@/components/track-click" // Make sure this import exists

// Inner component that uses searchParams
function HeaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <>
      <div className="w-full bg-primary h-4"></div>
      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <TrackClick eventName="logo_click" eventData={{ location: "header" }}>
              <Link href="/" className="flex items-center">
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
            </TrackClick>
            <nav className="hidden md:flex gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "home" }}>
                      <Link href="/" className="uppercase text-sm font-medium px-4">
                        HOME
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "visit_us" }}>
                      <Link href="/visit-us" className="uppercase text-sm font-medium px-4">
                        VISIT US
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "about_us" }}>
                      <Link href="/about-us" className="uppercase text-sm font-medium px-4">
                        ABOUT US
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "contact" }}>
                      <Link href="/contact" className="uppercase text-sm font-medium px-4">
                        CONTACT
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <TrackClick eventName="contact_method_click" eventData={{ method: "whatsapp_header" }}>
              <Link
                href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                className="hidden md:flex"
              >
                <Button variant="outline" size="sm" className="ml-2">
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </Link>
            </TrackClick>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-6">
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "home" }}>
                    <Link href="/" className="text-lg font-medium uppercase">
                      HOME
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "visit_us" }}>
                    <Link href="/visit-us" className="text-lg font-medium uppercase">
                      VISIT US
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "about_us" }}>
                    <Link href="/about-us" className="text-lg font-medium uppercase">
                      ABOUT US
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "contact" }}>
                    <Link href="/contact" className="text-lg font-medium uppercase">
                      CONTACT
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="contact_method_click" eventData={{ method: "whatsapp_mobile_menu" }}>
                    <Link
                      href="https://wa.me/6560190775?text=Hi%20Essen!%20I%20like%20to%20claim%20my%20In-Store%20Offer!"
                      className="mt-4"
                    >
                      <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        WhatsApp Chat
                      </Button>
                    </Link>
                  </TrackClick>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}

// Main exported component with Suspense boundary
export function Header() {
  return (
    <Suspense fallback={
      <div>
        <div className="w-full bg-primary h-4"></div>
        <header className="sticky top-0 z-50 w-full bg-background border-b">
          <div className="container flex h-16 items-center justify-between">
            {/* Simple loading state */}
            <div className="w-[180px] h-[48px] bg-muted animate-pulse rounded"></div>
          </div>
        </header>
      </div>
    }>
      <HeaderContent />
    </Suspense>
  )
}