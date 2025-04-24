"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useUmami } from "@/hooks/use-umami" // Add this import
import { TrackClick } from "@/components/track-click" // Add this import
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "./ui/carousel"

interface GoogleReview {
  author_name: string
  profile_photo_url: string
  rating: number
  text: string
  relative_time_description: string
  time: number
}

interface GoogleReviewsData {
  rating: number
  total_reviews: number
  reviews: GoogleReview[]
  fallback?: boolean
  error?: string
  message?: string
  fetchTime?: string
}

export function GoogleReviewsSection() {
  const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { trackEvent } = useUmami() // Add this hook

  // Function to fetch reviews - only called once on component mount
  const fetchReviews = async () => {
    try {
      setLoading(true)

      // Add a cache-busting query parameter to ensure we get the latest data from the server
      // This doesn't affect server-side caching, just ensures we don't get a stale browser cache
      const cacheBuster = new Date().getTime()
      const response = await fetch(`/api/google-reviews?_=${cacheBuster}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        console.warn("API returned error:", data.error)
        setError(data.error)
        // Track error
        trackEvent("reviews_load_error", { error: data.error })
      }

      // Even if there's an error, we'll still use the fallback data provided by the API
      setReviewsData(data)

      // Track successful review loading
      trackEvent("reviews_loaded", {
        count: data.reviews?.length || 0,
        fallback: !!data.fallback,
        total_reviews: data.total_reviews || 0
      })
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Unable to load reviews at this time")

      // Track error
      trackEvent("reviews_load_error", { error: String(err) })

      // Set fallback data if API call completely fails
      setReviewsData({
        rating: 4.8,
        total_reviews: 32,
        reviews: [
          // Fallback reviews
        ],
        fallback: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch - only happens once when component mounts
    fetchReviews()
  }, [])

  // Track when the reviews section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackEvent("section_view", { section: "google_reviews" })
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById("google-reviews-section")
    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [trackEvent])

  return (
    <section id="google-reviews-section" className="py-16 bg-secondary">
      <div className="container">
        <div className="essen-section-subtitle">CUSTOMER REVIEWS</div>
        <h2 className="essen-section-title mb-12">WHAT OUR CUSTOMERS SAY</h2>
        <div className="flex items-center justify-center mb-8">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(reviewsData?.rating || 5) ? "fill-primary text-primary" : "fill-muted text-muted"}`}
              />
            ))}
          </div>
          <TrackClick eventName="google_reviews_link_click" eventData={{ rating: reviewsData?.rating || 4.8 }}>
            <Link
              href="https://maps.app.goo.gl/5YNjVuRRjCyGjNuY7"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 font-medium hover:text-primary transition-colors"
            >
              {reviewsData?.rating || 4.8}/5 from {reviewsData?.total_reviews || 32} Google Reviews
            </Link>
          </TrackClick>
        </div>

        {reviewsData?.fallback && !loading && (
          <div className="text-center mb-6 text-sm text-muted-foreground">
            <p>Showing our top customer reviews</p>
          </div>
        )}

        {/* Mobile Carousel (visible on small screens) */}
        <div className="block md:hidden">
          {loading ? (
            // Show skeleton loaders while loading
            <Carousel>
              <CarouselContent>
                {[...Array(3)].map((_, index) => (
                  <CarouselItem key={index}>
                    <Card className="border mx-2">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Skeleton key={i} className="h-4 w-4 mx-0.5" />
                            ))}
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                          <div>
                            <Skeleton className="h-4 w-24 mx-auto" />
                            <Skeleton className="h-3 w-16 mx-auto mt-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <Carousel autoplay={true} interval={6000} cooldownPeriod={12000} loop={true}>
              <CarouselContent>
                {reviewsData?.reviews.map((review, index) => (
                  <CarouselItem key={index}>
                    <Card className="border mx-2">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <Image
                            src={review.profile_photo_url || "/placeholder.svg?height=60&width=60"}
                            alt={review.author_name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground italic">"{review.text}"</p>
                          <div>
                            <p className="font-medium">{review.author_name}</p>
                            <p className="text-xs text-muted-foreground">{review.relative_time_description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          )}
        </div>

        {/* Desktop Grid (visible on medium and larger screens) */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {loading
            ? // Show skeleton loaders while loading
            [...Array(3)].map((_, index) => (
              <Card key={index} className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-4 mx-0.5" />
                      ))}
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <div>
                      <Skeleton className="h-4 w-24 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            : reviewsData?.reviews.map((review, index) => (
              <Card key={index} className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Image
                      src={review.profile_photo_url || "/placeholder.svg?height=60&width=60"}
                      alt={review.author_name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{review.text}"</p>
                    <div>
                      <p className="font-medium">{review.author_name}</p>
                      <p className="text-xs text-muted-foreground">{review.relative_time_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  )
}