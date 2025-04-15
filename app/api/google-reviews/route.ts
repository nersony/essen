import { NextResponse } from "next/server"

// Get API key and Place ID from environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const PLACE_ID = process.env.GOOGLE_MAPS_PLACE_ID

// Set a fixed revalidation period of 1 hour (in seconds)
export const revalidate = 3600

export async function GET() {
  try {
    // Check if API key and Place ID are available
    if (!GOOGLE_MAPS_API_KEY || !PLACE_ID) {
      console.log("Google Maps API key or Place ID is not configured, using fallback data")
      return NextResponse.json(
        {
          fallback: true,
          rating: 4.8,
          total_reviews: 32,
          reviews: getFallbackReviews(),
        },
        { status: 200 },
      )
    }

    // Fetch place details including reviews from Google Places API
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${GOOGLE_MAPS_API_KEY}`

    // Use no-store to always fetch fresh data, but the route itself will be cached according to revalidate setting
    const fetchOptions = { cache: "no-store" as RequestCache }

    console.log("Fetching from URL:", apiUrl.replace(GOOGLE_MAPS_API_KEY, "[REDACTED]"))

    const response = await fetch(apiUrl, fetchOptions)

    if (!response.ok) {
      console.error("Google API response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch reviews from Google API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Log response structure for debugging
    console.log("Google API response status:", data.status)
    console.log("Google API response has result:", !!data.result)

    // Check if the API returned an error
    if (data.status !== "OK" || !data.result) {
      console.error("Google Places API error:", data.status, data.error_message)
      throw new Error(`Google Places API error: ${data.status} ${data.error_message || ""}`)
    }

    // Check if reviews exist in the response
    if (!data.result.reviews || !Array.isArray(data.result.reviews)) {
      console.warn("No reviews found in Google API response")
      return NextResponse.json({
        rating: data.result.rating || 4.8,
        total_reviews: data.result.user_ratings_total || 32,
        reviews: getFallbackReviews(),
        fallback: true,
      })
    }

    // Filter for 4-5 star reviews, filter out inappropriate content, and sort by most recent
    let reviews = data.result.reviews
    reviews = reviews
      .filter((review) => review.rating >= 4) // Include 4 and 5 star reviews
      .filter((review) => !containsInappropriateContent(review.text)) // Filter out inappropriate content
      .sort((a, b) => b.time - a.time) // Sort by newest first
      .slice(0, 3) // Get top 3 most recent positive reviews

    // If no positive reviews, just take the most recent reviews that don't contain inappropriate content
    if (reviews.length === 0) {
      console.log("No 4-5 star reviews found, using most recent appropriate reviews instead")
      reviews = data.result.reviews
        .filter((review) => !containsInappropriateContent(review.text))
        .sort((a, b) => b.time - a.time) // Sort by newest first
        .slice(0, 3)
    }

    // If still no reviews after filtering, use fallback
    if (reviews.length === 0) {
      console.log("No appropriate reviews found, using fallback reviews")
      reviews = getFallbackReviews()
    }

    return NextResponse.json({
      rating: data.result.rating || 4.8,
      total_reviews: data.result.user_ratings_total || 32,
      reviews,
      fallback: reviews === getFallbackReviews(),
      fetchTime: new Date().toISOString(), // Add timestamp for debugging
    })
  } catch (error) {
    console.error("Error fetching Google reviews:", error)
    // Return fallback data with 200 status to prevent client-side errors
    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
        fallback: true,
        rating: 4.8,
        total_reviews: 32,
        reviews: getFallbackReviews(),
      },
      { status: 200 },
    )
  }
}

// Function to check if text contains inappropriate content
function containsInappropriateContent(text: string): boolean {
  if (!text) return false

  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()

  // List of inappropriate words to filter
  const inappropriateWords = [
    "fuck",
    "shit",
    "ass",
    "bitch",
    "damn",
    "crap",
    "piss",
    "dick",
    "cock",
    "pussy",
    "asshole",
    "bastard",
    "slut",
    "douche",
    "cunt",
    "whore",
    "hell",
    "idiot",
    "stupid",
    "dumb",
    "loser",
    "terrible",
    "awful",
    "horrible",
    "worst",
    "hate",
    "sucks",
    "garbage",
  ]

  // Check if any inappropriate words are in the text
  return inappropriateWords.some((word) => {
    // Check for whole words by ensuring word boundaries
    const regex = new RegExp(`\\b${word}\\b`, "i")
    return regex.test(lowerText)
  })
}

// Fallback reviews to use when API fails
function getFallbackReviews() {
  return [
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
  ]
}
