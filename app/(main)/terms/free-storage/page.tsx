import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Storage",
  description:
    "Details about ESSEN Singapore's free storage policy for purchased furniture, including storage duration and extended storage fees.",
  alternates: {
    canonical: "https://essen.sg/terms/free-storage",
  },
}

export default function FreeStoragePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Free Storage</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          ESSEN offers complimentary storage for up to 2 months from the estimated delivery date. Beyond this period, a
          storage fee of 5% of the item's value will be charged monthly. To request this service, please email us at{" "}
          <a href="mailto:support@essen.sg" className="text-primary hover:underline">
            support@essen.sg
          </a>
          .
        </p>

        <div className="bg-secondary p-6 rounded-md mt-8">
          <h2 className="text-xl font-bold mb-4">Storage Policy Summary</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                1
              </span>
              <span>
                <strong>Free Period:</strong> 2 months from estimated delivery date
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                2
              </span>
              <span>
                <strong>Extended Storage Fee:</strong> 5% of item value per month after free period
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                3
              </span>
              <span>
                <strong>How to Request:</strong> Email{" "}
                <a href="mailto:support@essen.sg" className="text-primary hover:underline">
                  support@essen.sg
                </a>
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-8 p-4 border border-primary rounded-md">
          <p className="font-medium">
            Note: Please request storage service as early as possible to ensure availability.
          </p>
        </div>
      </div>
    </div>
  )
}
