"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Menu, Phone } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TrackClick } from "@/components/track-click" // Make sure this import exists
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="w-full bg-primary h-4"></div>
      <header className="sticky top-0 z-50 w-full bg-background border-b">
        <div className="container flex h-14 md:h-16 items-center justify-between px-2 md:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10">
            <TrackClick eventName="logo_click" eventData={{ location: "header" }}>
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
                <div
                  style={{ width: "150px", height: "48px", position: "relative" }}
                  className="md:w-[115px] lg:w-[115px] md:h-[40px] lg:h-[48px]"
                >
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
            <nav className="hidden md:flex gap-2 lg:gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "home" }}>
                      <Link href="/" className="uppercase text-xs md:text-sm font-medium px-2 lg:px-4">
                        HOME
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "furniture" }}>
                      <Link href="/products" className="uppercase text-xs md:text-sm font-medium px-2 lg:px-4">
                        Furniture
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "our_showroom" }}>
                      <Link href="/showroom" className="uppercase text-xs md:text-sm font-medium px-2 lg:px-4">
                        OUR SHOWROOM
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "visit_us" }}>
                      <Link href="/visit-us" className="uppercase text-xs md:text-sm font-medium px-2 lg:px-4">
                        VISIT US
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "about_us" }}>
                      <Link href="/about-us" className="uppercase text-xs md:text-sm font-medium px-2 lg:px-4">
                        ABOUT US
                      </Link>
                    </TrackClick>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <TrackClick eventName="navigation" eventData={{ destination: "contact" }}>
                      <Link href="/contact" className="uppercase text-xs md:text-sm font-medium px-2 lg:px-4">
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
                  <span className="hidden lg:inline">WhatsApp</span>
                  <span className="lg:hidden">Chat</span>
                </Button>
              </Link>
            </TrackClick>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <VisuallyHidden>
                  <SheetTitle>Mobile Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col gap-6 py-6">
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "home" }}>
                    <Link href="/" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                      HOME
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "furniture" }}>
                    <Link href="/products" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                      FURNITURE
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "our_showroom" }}>
                    <Link href="/showroom" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                      OUR SHOWROOM
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "visit_us" }}>
                    <Link href="/visit-us" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                      VISIT US
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "about_us" }}>
                    <Link href="/about-us" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                      ABOUT US
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="mobile_navigation" eventData={{ destination: "contact" }}>
                    <Link href="/contact" className="text-lg font-medium uppercase" onClick={() => setOpen(false)}>
                      CONTACT
                    </Link>
                  </TrackClick>
                  <TrackClick eventName="contact_method_click" eventData={{ method: "whatsapp_mobile_menu" }}>
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
                  </TrackClick>
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
