export default function CancellationPolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Cancellation Policy</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          If you change your mind and wish to cancel your order, please inform us within 48 hours of purchase to avoid
          any fees. All cancellation requests must be sent via email to{" "}
          <a href="mailto:support@essen.sg" className="text-primary hover:underline">
            support@essen.sg
          </a>
          .
        </p>

        <p className="mb-4">
          Cancellation requests made after 48 hours will incur the following fees for regular-priced items:
        </p>

        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>For products valued under SGD 500: SGD 50 per item.</li>
          <li>For products valued over SGD 500: 5% of the product value.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">
          The cancellation policy does not apply to the following non-regular priced items:
        </h2>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Promotional/Discounted Products</li>
          <li>Display Pieces</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4">Additionally, no changes can be made to the following items:</h2>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Promotional/Discounted Products</li>
          <li>Display Pieces</li>
          <li>Customized/Made-to-order items (e.g., sofas, mattresses, specific bed frame models).</li>
        </ul>
      </div>
    </div>
  )
}
