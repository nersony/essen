export default function DeliveryInformationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Delivery Policy</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          The delivery fee is waived for orders over $500 SGD, unless otherwise specified by ESSEN. For orders below
          $500, a delivery fee applies. The delivery fee for orders depends on their total value. We do not offer
          delivery services on Sundays or Public Holidays.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What the delivery fee covers:</h2>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Order processing</li>
          <li>Product handling and packing</li>
          <li>Delivery, including product assembly, to your chosen location within Singapore.</li>
        </ul>

        <p className="my-4">
          For self-assembly, please follow the provided assembly instructions (AI). Any assembly mistakes or failure to
          follow the AI will void the warranty. ESSEN offers free furniture installation upon request.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Additional charges</h2>
        <p className="mb-2">Additional charges apply for deliveries without lift access:</p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Weekdays: $60</li>
          <li>Weekends: $90</li>
          <li>
            Non-lift accessible levels: $15 per item per storey (excluding ground level). $50 for item above 50kg.
          </li>
        </ul>

        <p className="my-4">
          As we deal with different suppliers, items may arrive at different times at our distribution points. As such,
          should you require your order to be sent separately, you will be charged a delivery fee for any additional
          deliveries.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Scheduling / Rescheduling of Delivery</h2>
        <p className="my-4">
          At the time of purchase, the sales team will secure a delivery slot for the customer based on availability.
          Any rescheduling must be requested at least 3 working days in advance, or a rescheduling fee will apply.
          Rescheduled deliveries are also subject to availability. Please note that delivery slots may be limited during
          peak periods or after promotional events.
        </p>

        <p className="my-4">
          Our in-house deliveries are arranged into time slots (e.g., 9 am – 12 pm, 1 pm – 5:30 pm), and we cannot
          accommodate specific or fixed delivery times, such as 10 am or 3 pm. The assigned time slot will be confirmed
          2-3 days before the scheduled delivery.
        </p>

        <p className="my-4">
          All delivery plans are managed by our logistics provider, and while we strive to accommodate timing requests,
          we may not be able to fulfill all of them. However, any property restrictions should be communicated as early
          as possible, and we will take them into account when scheduling delivery time slots.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Delivery Delays</h2>
        <p className="my-4">
          Delivery on the scheduled day may sometimes be impacted by traffic, weather, or other unforeseen circumstances
          beyond our control. In such instances, our delivery team will do their best to inform you of any potential
          delays. However, we are not responsible for these delays, and we appreciate your understanding. Please note
          that if multiple deliveries are needed, additional fees will apply for each shipment.
        </p>
      </div>
    </div>
  )
}
