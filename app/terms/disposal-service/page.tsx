import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disposal Service",
  description:
    "Information about ESSEN Singapore's furniture disposal service, including fees and what items can be disposed of when purchasing new furniture.",
  alternates: {
    canonical: "https://essen.sg/terms/disposal-service",
  },
}

export default function DisposalServicePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Disposal Service</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          We provide disposal services upon request, subject to an additional fee. The disposal charge is $30 for
          medium-sized items, including but not limited to dining tables, pairs of dining chairs, coffee tables, and
          side tables. For larger items, such as 2-3 seater sofas, L-shaped sofas, bed frames, and mattresses, the
          disposal fee is $50. This service must be requested prior to delivery, and the applicable fee will be added to
          the final invoice.
        </p>

        <div className="bg-secondary p-6 rounded-md mt-8">
          <h2 className="text-xl font-bold mb-4">Disposal Fee Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Medium-sized items ($30)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dining tables</li>
                <li>Pairs of dining chairs</li>
                <li>Coffee tables</li>
                <li>Side tables</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Larger items ($50)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>2-3 seater sofas</li>
                <li>L-shaped sofas</li>
                <li>Bed frames</li>
                <li>Mattresses</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 border border-primary rounded-md">
          <p className="font-medium">
            Important: Disposal service must be requested prior to delivery. The applicable fee will be added to your
            final invoice.
          </p>
        </div>
      </div>
    </div>
  )
}
