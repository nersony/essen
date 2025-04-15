export default function FAQPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Frequently Asked Questions</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to our most commonly asked questions. If you can't find what you're looking for, please contact
          us directly.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold">1. What materials are your furniture pieces made from?</h3>
            <p className="mt-2">
              We offer a variety of materials, including solid wood, leather, fabric, and eco-friendly options. Each
              product description provides detailed information about the materials used.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">2. Do you offer customization options?</h3>
            <p className="mt-2">
              Yes, many of our furniture pieces can be customized in terms of color, fabric, size, and finish. Contact
              us or visit our store to learn more about customization options.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">3. How long does delivery take?</h3>
            <p className="mt-2">
              For in-stock items, delivery typically takes 3-7 business days. Custom orders may take longer, and
              estimated delivery times will be provided at the time of purchase.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">4. How much is the delivery fee?</h3>
            <p className="mt-2">
              Delivery is free for orders over $500 SGD. For orders below $500 SGD, the delivery fee depends on their
              total value. Separate deliveries will incur additional fees. Note that we do not offer delivery services
              on Sundays or Public Holidays. Please review our delivery policy for more details.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">5. Do you offer assembly services?</h3>
            <p className="mt-2">
              Yes, we provide professional assembly services for most of our furniture items. Please ask about our
              assembly options at checkout.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">6. What is your return policy?</h3>
            <p className="mt-2">
              We offer a 14-day return policy for most of our products. Items must be in their original condition and
              packaging. To arrange a return, please contact us at enquiries@essen.sg, and our team will reach out to
              schedule the collection. Please review our return policy for more details.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">7. Is it possible to cancel or modify my order?</h3>
            <p className="mt-2">
              If you change your mind and wish to cancel your order, please inform us within 48 hours of purchase to
              avoid any fees. All cancellation requests must be sent via email to support@essen.sg. Cancellation
              requests submitted after 48 hours will be subject to fees for regular-priced items.
            </p>
            <p className="mt-2">Please review our cancellation policy for more details.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">8. Do you have a warranty on your products?</h3>
            <p className="mt-2">
              Most of our products come with a manufacturer's warranty that covers defects in materials or workmanship.
              Please refer to individual product listings for specific warranty details.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">9. Can I see the furniture in person before purchasing?</h3>
            <p className="mt-2">
              Visit our showroom to see and feel the furniture before making a decision. Our team will be happy to
              assist you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
