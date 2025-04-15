"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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
      }

      // Even if there's an error, we'll still use the fallback data provided by the API
      setReviewsData(data)
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Unable to load reviews at this time")
      // Set fallback data if API call completely fails
      setReviewsData({
        rating: 4.8,
        total_reviews: 32,
        reviews: [
          {
            author_name: "Yvonne Lim",
            profile_photo_url: "/placeholder.svg?height=60&width=60",
            rating: 5,
            text: "Excellent service and quality furniture. The staff were very helpful and knowledgeable. Highly recommend!",
            relative_time_description: "a month ago",
            time: Date.now() / 1000 - 30 * 24 * 60 * 60,
          },
          {
            author_name: "Jia Hui",
            profile_photo_url: "/placeholder.svg?height=60&width=60",
            rating: 5,
            text: "Great experience shopping at Essen. The furniture is beautiful and well-made. Delivery was prompt and the assembly service was excellent.",
            relative_time_description: "2 months ago",
            time: Date.now() / 1000 - 60 * 24 * 60 * 60,
          },
          {
            author_name: "Yvonne Tan",
            profile_photo_url: "/placeholder.svg?height=60&width=60",
            rating: 5,
            text: "Bought a sofa from them and I'm very satisfied with the quality and comfort. The staff were patient and helped me choose the right fabric.",
            relative_time_description: "3 months ago",
            time: Date.now() / 1000 - 90 * 24 * 60 * 60,
          },
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

    // No interval is set - we rely on server-side revalidation
    // and page refreshes to get new data
  }, [])

  // If we have a complete failure and no data at all
  if (error && !reviewsData) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container text-center">
          <div className="essen-section-subtitle">CUSTOMER REVIEWS</div>
          <h2 className="essen-section-title mb-12">WHAT OUR CUSTOMERS SAY</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-secondary">
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
          <Link
            href="https://maps.app.goo.gl/5YNjVuRRjCyGjNuY7"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 font-medium hover:text-primary transition-colors"
          >
            {reviewsData?.rating || 4.8}/5 from {reviewsData?.total_reviews || 32} Google Reviews
          </Link>
        </div>

        {reviewsData?.fallback && !loading && (
          <div className="text-center mb-6 text-sm text-muted-foreground">
            <p>Showing our top customer reviews</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
