"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function CheckoutResultPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")
    const status = searchParams.get("status")

    if (status === "completed") {
      setStatus("success")
      // In a real implementation, you would fetch order details from your database
      setOrderDetails({
        reference: reference,
        date: new Date().toLocaleDateString(),
      })
    } else {
      setStatus("failed")
    }
  }, [searchParams])

  if (status === "loading") {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <p>Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            {status === "success" ? (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-center">Payment Successful</CardTitle>
                <CardDescription className="text-center">Thank you for your purchase!</CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <CardTitle className="text-center">Payment Failed</CardTitle>
                <CardDescription className="text-center">There was an issue processing your payment.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {status === "success" && orderDetails && (
              <div className="space-y-4">
                <div className="border-t border-b py-4">
                  <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
                  <p className="font-medium">{orderDetails.reference}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">{orderDetails.date}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
            )}
            {status === "failed" && (
              <div className="space-y-4">
                <p>Your payment could not be processed. Please try again or contact our customer support.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === "success" ? (
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/checkout">Try Again</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
