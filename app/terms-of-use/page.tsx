import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | ESSEN Singapore",
  description:
    "Read the terms and conditions for ESSEN furniture store in Singapore. Information about sales, pricing, warranties, and disclaimers.",
  alternates: {
    canonical: "https://essen.sg/terms-of-use",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfUsePage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 uppercase">Terms & Conditions</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            ESSEN reserves the right to cancel or terminate any sales order at its discretion, even if the order has
            already been confirmed and paid for by the customer, with or without prior notice. ESSEN will not be held
            liable for any such cancellations or terminations. In such cases, a full refund will be provided to the
            customer.
          </p>

          <p className="mb-6">
            Unless specified otherwise, all quoted prices include goods and service tax. Both online and in-store
            purchases are subject to the same warranty, exchange, and return policies.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimers</h2>
          <p className="mb-6">All products sold are not designed by ESSEN unless otherwise specified.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Terms of Use</h2>
          <p className="mb-6">
            Welcome to ESSEN. By accessing or using our website, you agree to be bound by the following terms and
            conditions. All content, products, and services provided on this site are for informational purposes only
            and subject to change without notice. We strive to ensure the accuracy of the information provided, but we
            do not guarantee its completeness or reliability. By using this site, you acknowledge that it is your
            responsibility to verify any information before making a purchase. Unauthorized use of this website may
            result in legal action. Please review our privacy policy for details on how we handle your personal
            information.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Product Specifications Disclosure</h2>
          <p className="mb-4">
            Certain products may have unfinished or partially finished surfaces, including but not limited to the
            undersides of table tops, legs, the backs of chests, tops of wardrobes, the bottoms of drawers, and bed
            slats. These are not considered defects, under conditions including but not limited to the following:
          </p>

          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>
              Fiberglass and polished stainless steel items may exhibit minor scratches and undulations, which are not
              classified as defects.
            </li>
            <li>
              Leathers and fabrics commonly used, such as wool, viscose, nylon, and genuine cow or buffalo hide leather,
              may cause allergic reactions. Customers are responsible for ensuring they are not allergic to these
              materials before purchasing, and the Company is not liable for such claims.
            </li>
            <li>
              The packaging for most products includes cardboard and other materials, which may occasionally cause minor
              "micro-scratches" on the product's surface. These are typically touched up by the delivery or service team
              during delivery and are not considered defects.
            </li>
            <li>
              Variations in color, grain, and texture are natural characteristics of the product materials, and changes
              due to aging and use do not constitute defects.
            </li>
            <li>
              Newly assembled or installed items may not rest perfectly flush with the floor immediately but will settle
              over approximately 3 to 7 days of use.
            </li>
            <li>
              Sofas may have crumples, indentations, or depressions when first unpacked, which will diminish over time.
              This is not considered a defect.
            </li>
            <li>
              Items purchased at different times, even if similar models or materials, may show variations in color and
              texture that do not constitute defects.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Goods Sold As-Is</h2>
          <p className="mb-6">
            Products sold during promotional events, marked "As-Is," as floor samples, or surplus display items may have
            cosmetic imperfections and may not appear brand new. The Customer acknowledges these defects upon purchase,
            and the discounted price reflects this understanding.
          </p>
        </div>
      </div>
    </div>
  )
}
