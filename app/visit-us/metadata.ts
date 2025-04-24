import type { Metadata } from "next"

const metadata: Metadata = {
  title: "Visit Us | ESSEN Furniture Showroom in Singapore",
  description:
    "Visit our furniture showroom in Singapore. Get directions, opening hours, and plan your visit to experience our premium furniture collections in person.",
  alternates: {
    canonical: "https://essen.sg/visit-us",
  },
  openGraph: {
    title: "Visit ESSEN Furniture Showroom in Singapore",
    description:
      "Plan your visit to our furniture showroom in Singapore. Get directions, opening hours, and information about our in-store experience.",
    url: "https://essen.sg/visit-us",
    images: [
      {
        url: "/images/essen-visit-og.jpg",
        width: 1200,
        height: 630,
        alt: "ESSEN Singapore Showroom Location",
      },
    ],
  },
  twitter: {
    title: "Visit ESSEN Furniture Showroom in Singapore",
    description:
      "Plan your visit to our furniture showroom in Singapore. Get directions, opening hours, and information about our in-store experience.",
    images: ["/images/essen-visit-twitter.jpg"],
  },
  // Add structured data for local business
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      name: "ESSEN Singapore",
      image: "https://essen.sg/images/essen-store-front.jpg",
      "@id": "https://essen.sg",
      url: "https://essen.sg",
      telephone: "+6560190775",
      address: {
        "@type": "PostalAddress",
        streetAddress: "36 Jalan Kilang Barat",
        addressLocality: "Singapore",
        postalCode: "159366",
        addressCountry: "SG",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 1.2896110990636652,
        longitude: 103.80229491475403,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "11:00",
        closes: "20:00",
      },
      sameAs: [
        "https://www.facebook.com/p/essensg-61560718696802",
        "https://www.instagram.com/essen.sg",
        "https://www.tiktok.com/@essen.sg",
      ],
    }),
  },
}

export default metadata
