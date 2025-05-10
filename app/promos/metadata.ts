import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Great Singapore Sale | ESSEN Promotions",
  description:
    "Enjoy up to 50% off during ESSEN's Great Singapore Sale. Spin the wheel to win exciting prizes, explore exclusive in-store promotions, and transform your home.",
  alternates: {
    canonical: "https://essen.sg/promos",
  },
  openGraph: {
    title: "Great Singapore Sale | ESSEN Promotions",
    description:
      "Enjoy up to 50% off during ESSEN's Great Singapore Sale. Spin the wheel to win exciting prizes and explore exclusive in-store promotions.",
    url: "https://essen.sg/promos",
    images: [
      {
        url: "https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Banner1.png",
        width: 1200,
        height: 630,
        alt: "ESSEN Great Singapore Sale",
      },
    ],
  },
  twitter: {
    title: "Great Singapore Sale | ESSEN Promotions",
    description:
      "Enjoy up to 50% off during ESSEN's Great Singapore Sale. Spin the wheel to win exciting prizes and explore exclusive in-store promotions.",
    images: ["https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/promo/Banner1.png"],
  },
}

export default metadata