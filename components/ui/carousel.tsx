"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType, type EmblaCarouselType } from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin[]
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  autoplay?: boolean
  interval?: number
  cooldownPeriod?: number
  loop?: boolean
  className?: string
  children: React.ReactNode
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  onUserInteraction: () => void
  isAutoPlaying: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins: userPlugins = [],
      className,
      children,
      autoplay = false,
      interval = 5000,
      cooldownPeriod = 5000,
      loop = true,
      ...props
    },
    ref,
  ) => {
    // Setup autoplay with our refactored hook
    const {
      plugin: autoplayPlugin,
      onUserInteraction,
      isPlaying: isAutoPlaying,
      setEmblaApi,
    } = useCarouselAutoplay({
      delay: interval,
      cooldownPeriod: cooldownPeriod,
      enabled: autoplay,
    })

    // Combine plugins
    const plugins = React.useMemo(() => {
      const allPlugins = [...(userPlugins || [])]
      if (autoplay && autoplayPlugin) {
        allPlugins.push(autoplayPlugin)
      }
      return allPlugins
    }, [autoplay, autoplayPlugin, userPlugins])

    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        loop,
      },
      plugins,
    )

    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    // Update the Embla API reference in our autoplay hook
    React.useEffect(() => {
      if (api) {
        setEmblaApi(api)
      }
    }, [api, setEmblaApi])

    const onSelect = React.useCallback((api: EmblaCarouselType) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      if (!api) return
      api.scrollPrev()
      onUserInteraction()
    }, [api, onUserInteraction])

    const scrollNext = React.useCallback(() => {
      if (!api) return
      api.scrollNext()
      onUserInteraction()
    }, [api, onUserInteraction])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext],
    )

    // Set up event listeners for user interactions
    React.useEffect(() => {
      if (!api || !autoplay) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      // Get the carousel root element
      const emblaRoot = carouselRef?.current
      if (!emblaRoot) return

      // Create a single handler for all interaction events
      const handleInteraction = () => onUserInteraction()

      // Add event listeners for various user interactions
      emblaRoot.addEventListener("mousedown", handleInteraction)
      emblaRoot.addEventListener("touchstart", handleInteraction, { passive: true })
      emblaRoot.addEventListener("keydown", handleInteraction)

      // Clean up event listeners on unmount
      return () => {
        emblaRoot.removeEventListener("mousedown", handleInteraction)
        emblaRoot.removeEventListener("touchstart", handleInteraction)
        emblaRoot.removeEventListener("keydown", handleInteraction)
        api.off("select", onSelect)
        api.off("reInit", onSelect)
      }
    }, [api, autoplay, carouselRef, onSelect, onUserInteraction])

    // Set external API if provided
    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          autoplay,
          interval,
          loop,
          onUserInteraction,
          isAutoPlaying,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    )
  },
)
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    )
  },
)
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  },
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  },
)
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { api, onUserInteraction } = useCarousel()
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    React.useEffect(() => {
      if (!api) return

      setScrollSnaps(api.scrollSnapList())

      const onSelect = () => {
        setSelectedIndex(api.selectedScrollSnap())
      }

      api.on("select", onSelect)
      api.on("reInit", onSelect)

      return () => {
        api.off("select", onSelect)
        api.off("reInit", onSelect)
      }
    }, [api])

    const handleDotClick = (index: number) => {
      if (!api) return
      api.scrollTo(index)
      onUserInteraction()
    }

    return (
      <div ref={ref} className={cn("flex justify-center gap-1 mt-4", className)} {...props}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === selectedIndex ? "bg-primary" : "bg-gray-300",
            )}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )
  },
)
CarouselDots.displayName = "CarouselDots"

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots }
