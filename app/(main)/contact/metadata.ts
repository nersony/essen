import type { Metadata } from "next"

const metadata: Metadata = {
  title: "Contact Us | ESSEN Furniture Singapore",
  description:
    "Contact ESSEN furniture store in Singapore. Reach out to us with questions, book a design consultation, or get directions to our showroom.",
  alternates: {
    canonical: "https://essen.sg/contact",
  },
  openGraph: {
    title: "Contact ESSEN Furniture Singapore",
    description:
      "Contact ESSEN furniture store in Singapore. Reach out to us with questions, book a design consultation, or get directions to our showroom.",
    url: "https://essen.sg/contact",
    images: [
      {
        url: "/images/essen-contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact ESSEN Singapore",
      },
    ],
  },
  twitter: {
    title: "Contact ESSEN Furniture Singapore",
    description:
      "Contact ESSEN furniture store in Singapore. Reach out to us with questions, book a design consultation, or get directions to our showroom.",
    images: ["/images/essen-contact-twitter.jpg"],
  },
}

export default metadata
