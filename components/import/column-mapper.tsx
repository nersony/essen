"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColumnMapperProps {
  headers: string[]
  onMappingComplete: (mapping: Record<string, string>) => void
  onCancel: () => void
}

export function ColumnMapper({ headers, onMappingComplete, onCancel }: ColumnMapperProps) {
  // Define product fields with descriptions
  const productFields = [
    {
      id: "name",
      label: "Product Name",
      description: "The name of the product",
      required: true,
    },
    {
      id: "slug",
      label: "Slug",
      description: "URL-friendly version of the name (auto-generated if not provided)",
      required: false,
    },
    {
      id: "category",
      label: "Category",
      description: "The product category",
      required: true,
    },
    {
      id: "price",
      label: "Price",
      description: "Base price of the product",
      required: false,
    },
    {
      id: "description",
      label: "Description",
      description: "Detailed product description",
      required: true,
    },
    {
      id: "features",
      label: "Features",
      description: "Product features (semicolon separated)",
      required: false,
    },
    {
      id: "careInstructions",
      label: "Care Instructions",
      description: "Care instructions (semicolon separated)",
      required: false,
    },
    {
      id: "deliveryTime",
      label: "Delivery Time",
      description: "Estimated delivery time",
      required: false,
    },
    {
      id: "warranty",
      label: "Warranty",
      description: "Warranty information",
      required: false,
    },
    {
      id: "inStock",
      label: "In Stock",
      description: "Whether the product is in stock (TRUE/FALSE)",
      required: false,
    },
    {
      id: "isWeeklyBestSeller",
      label: "Weekly Best Seller",
      description: "Whether the product is a weekly best seller (TRUE/FALSE)",
      required: false,
    },
    {
      id: "materials",
      label: "Materials",
      description: "Available materials (semicolon separated)",
      required: false,
    },
    {
      id: "dimensions",
      label: "Dimensions",
      description: "Available dimensions (semicolon separated)",
      required: false,
    },
    {
      id: "materialDimensionPrices",
      label: "Material/Dimension Prices",
      description: "Format: Material|Dimension|Price|InStock (semicolon separated)",
      required: false,
    },
    {
      id: "addOns",
      label: "Add-ons",
      description: "Format: Name|Price (semicolon separated)",
      required: false,
    },
  ]

  // Initialize mapping state
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])

  // Auto-map columns on component mount
  useEffect(() => {
    const initialMapping: Record<string, string> = {}

    // Try to auto-map columns based on header names
    productFields.forEach((field) => {
      const matchingHeader = headers.find((header) => header.toLowerCase() === field.id.toLowerCase())
      if (matchingHeader) {
        initialMapping[field.id] = matchingHeader
      }
    })

    setMapping(initialMapping)
  }, [headers])

  // Handle mapping change
  const handleMappingChange = (fieldId: string, headerValue: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldId]: headerValue === "none" ? "" : headerValue,
    }))
  }

  // Handle continue button click
  const handleContinue = () => {
    const errors: string[] = []

    // Validate required fields
    productFields
      .filter((field) => field.required)
      .forEach((field) => {
        if (!mapping[field.id]) {
          errors.push(`${field.label} is required but not mapped to any column`)
        }
      })

    if (errors.length > 0) {
      setErrors(errors)
      return
    }

    onMappingComplete(mapping)
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>Map Excel Columns</CardTitle>
        <CardDescription>
          Map your Excel columns to the corresponding product fields. Required fields are marked with an asterisk (*).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center">
                  <label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <HelpCircle className="h-3 w-3" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{field.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={mapping[field.id] || "none"}
                  onValueChange={(value) => handleMappingChange(field.id, value)}
                >
                  <SelectTrigger id={field.id}>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-50 border-t">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </CardFooter>
    </Card>
  )
}
