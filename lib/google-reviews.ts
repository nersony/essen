// This file simulates fetching Google Reviews
// In a production environment, this would be a server-side API call
// using Google Places API with your API key

export interface GoogleReview {
  id: string
  author_name: string
  profile_photo_url: string
  rating: number
  text: string
  relative_time_description: string
}

// This data would normally come from a server-side API call
// For now, we're hardcoding the top reviews from your Google page
export const googleReviews: GoogleReview[] = [
  {
    id: "1",
    author_name: "Yvonne Lim",
    profile_photo_url: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Excellent service and quality furniture. The staff were very helpful and knowledgeable. Highly recommend!",
    relative_time_description: "a month ago",
  },
  {
    id: "2",
    author_name: "Jia Hui",
    profile_photo_url: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Great experience shopping at Essen. The furniture is beautiful and well-made. Delivery was prompt and the assembly service was excellent.",
    relative_time_description: "2 months ago",
  },
  {
    id: "3",
    author_name: "Yvonne Tan",
    profile_photo_url: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Bought a sofa from them and I'm very satisfied with the quality and comfort. The staff were patient and helped me choose the right fabric.",
    relative_time_description: "3 months ago",
  },
  {
    id: "4",
    author_name: "Cheryl Tan",
    profile_photo_url: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Visited the showroom and was impressed by the quality and design of their furniture. The staff were friendly and not pushy at all.",
    relative_time_description: "a month ago",
  },
  {
    id: "5",
    author_name: "Jasmine Lim",
    profile_photo_url: "/placeholder.svg?height=60&width=60",
    rating: 4,
    text: "Good quality furniture at reasonable prices. The delivery was on time and the assembly team was professional.",
    relative_time_description: "2 months ago",
  },
]

export function getTopReviews(count = 3): GoogleReview[] {
  // In a real implementation, this would sort by recency or rating
  // For now, we're just returning the first 'count' reviews
  return googleReviews.slice(0, count)
}

export function getAverageRating(): number {
  const sum = googleReviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / googleReviews.length) * 10) / 10 // Round to 1 decimal place
}

export function getReviewCount(): number {
  // In a real implementation, this would come from the API
  return 32 // Example count from your Google page
}
