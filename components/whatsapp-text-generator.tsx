"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Copy, Check } from "lucide-react"
import type { Product } from "@/lib/db/schema"

interface WhatsAppTextGeneratorProps {
  product: Product
}

export function WhatsAppTextGenerator({ product }: WhatsAppTextGeneratorProps) {
  const [copied, setCopied] = useState(false)

  // Generate WhatsApp text based on product data
  const generateWhatsAppText = (): string => {
    let text = `*${product.name}*\n\n`

    // Add description
    text += `${product.description}\n\n`

    // Add features
    if (product.features && product.features.length > 0) {
      text += "*Features:*\n"
      product.features.forEach((feature) => {
        text += `• ${feature}\n`
      })
      text += "\n"
    }

    // Add variants information if available
    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0]

      // Add materials
      if (variant.materials && variant.materials.length > 0) {
        text += "*Available Materials:*\n"
        variant.materials.forEach((material) => {
          text += `• ${material.name}`
          if (material.description) text += ` - ${material.description}`
          text += "\n"
        })
        text += "\n"
      }

      // Add dimensions
      if (variant.dimensions && variant.dimensions.length > 0) {
        text += "*Available Dimensions:*\n"
        variant.dimensions.forEach((dimension) => {
          text += `• ${dimension.value}`
          if (dimension.description) text += ` - ${dimension.description}`
          text += "\n"
        })
        text += "\n"
      }

      // Add pricing information from combinations
      if (variant.combinations && variant.combinations.length > 0) {
        text += "*Pricing:*\n"
        variant.combinations.forEach((combo) => {
          if (combo.inStock) {
            text += `• ${combo.materialName} ${combo.dimensionValue}: $${combo.price.toFixed(2)}\n`
          }
        })
        text += "\n"
      }

      // Add add-ons if available
      if (variant.addOns && variant.addOns.length > 0) {
        text += "*Add-ons:*\n"
        variant.addOns.forEach((addon) => {
          text += `• ${addon.name}: +$${addon.price.toFixed(2)}\n`
        })
        text += "\n"
      }
    } else if (product.price) {
      // If no variants, just show the base price
      text += `*Price:* $${product.price.toFixed(2)}\n\n`
    }

    // Add delivery time
    if (product.deliveryTime) {
      text += `*Delivery Time:* ${product.deliveryTime}\n`
    }

    // Add warranty information
    if (product.warranty) {
      text += `*Warranty:* ${product.warranty}\n`
    }

    // Note: Return policy is intentionally excluded as requested

    // Add call to action
    text += "\nFor more information or to place an order, please contact us!"

    return text
  }

  const whatsAppText = generateWhatsAppText()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(whatsAppText)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "WhatsApp text has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Catalog Text</CardTitle>
        <CardDescription>
          Generated text for sharing this product on WhatsApp. Copy and paste into your WhatsApp messages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={whatsAppText}
          readOnly
          className="min-h-[300px] font-mono text-sm"
          placeholder="WhatsApp text will appear here"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={copyToClipboard} className="flex items-center gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </CardFooter>
    </Card>
  )
}
