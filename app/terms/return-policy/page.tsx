export default function ReturnPolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Return Policy</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          If you wish to return an item, you may do so within 14 days of delivery, subject to a restocking fee starting
          at 25%. For example, for an invoice amount of $500, the refund would be $375, with a $125 restocking fee. The
          final restocking fee will depend on the item's condition at the time of collection.
        </p>

        <p className="text-lg mb-4 font-medium">Please note that the delivery fee is non-refundable.</p>

        <p className="mb-4">
          Returns will not be accepted if, in our reasonable opinion, the item is no longer in acceptable condition due
          to wear and tear, misuse, or abnormal usage.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4">The return policy does not apply to the following items:</h2>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Customized items/orders (including but not limited to special orders and customized upholstery)</li>
          <li>Clearance/Sale Items</li>
          <li>Display Items</li>
        </ul>

        <p className="mt-6 mb-4">
          Refunds will be processed within 14 days from the collection date and credited via the original payment
          method. Commune reserves the right to change the refund method if necessary.
        </p>

        <p className="font-medium">Please note, returns will not be accepted after 14 days from the delivery date.</p>
      </div>
    </div>
  )
}
