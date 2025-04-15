export default function WarrantyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 uppercase">Warranty Policy</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          At ESSEN, we stand behind the quality of our products. Our warranty policy is designed to give you peace of
          mind with your purchase.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-primary">
                <th className="p-4 text-left text-white">TYPE</th>
                <th className="p-4 text-left text-white">WARRANTY COVERAGE</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 align-top">Sofas</td>
                <td className="p-4">
                  Frame structure: 3 Year Limited Warranty
                  <br />
                  Genuine leather: 3 Year Limited Warranty
                  <br />
                  Soft furnishings: Foam, fibre fillings, feathers, fabric covers, stitching, faux leather: 1 Year
                  Limited Warranty
                  <br />
                  Other components such as: zips, fasteners, springs, suspension, legs, and movable mechanisms: 1 Year
                  Limited Warranty
                </td>
              </tr>
              <tr className="border-b bg-muted">
                <td className="p-4 align-top">Dining Tables, Dining Chairs, Dining Benches, Cabinets, Coffee Tables</td>
                <td className="p-4">2 Year Limited Warranty</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 align-top">Bed Frames</td>
                <td className="p-4">
                  Frame structure: 3 Year Limited Warranty
                  <br />
                  Genuine leather: 3 Year Limited Warranty
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Not covered under the warranty:</h2>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Damage caused by using detergents, abrasives, or harsh cleaning agents.</li>
          <li>
            Damage due to negligence, abuse, accidents, or normal wear and tear, such as burns, cuts, scratches, tears,
            scuffs, watermarks, indentations, or pet damage.
          </li>
          <li>Wear and tear over time.</li>
          <li>Products used outdoors when not designed for outdoor use.</li>
          <li>Any unauthorized modifications made to the product by the customer will void the warranty.</li>
          <li>Incorrect self-assembly.</li>
          <li>Items purchased as 'Clearance Pieces' or 'Display Pieces.'</li>
          <li>
            Repaired or replaced items under this warranty are only covered for the remainder of the original warranty
            period.
          </li>
          <li>
            Manufacturing defects detected within the warranty period will cover the cost of materials, replacement
            parts, labor, and transportation.
          </li>
          <li>
            If an item is deemed defective due to misuse or wear and tear, the customer will be responsible for covering
            the cost of materials, replacement parts, labor, and transportation.
          </li>
          <li>The customer will bear these costs if manufacturing defects are detected after the warranty period.</li>
          <li>Products not used for domestic purposes.</li>
          <li>Products shipped or transferred to a different location/country.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Make a Warranty Claim</h2>
        <p>
          If you believe your product has a defect covered by our warranty, please contact our customer service team:
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>Email: enquiry@essen.sg</li>
          <li>WhatsApp: +65 6019 0775</li>
          <li>Visit our showroom with proof of purchase</li>
        </ul>
        <p>
          Our team will guide you through the warranty claim process, which may include providing photographs of the
          issue or arranging for an inspection.
        </p>
      </div>
    </div>
  )
}
