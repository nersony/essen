"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColumnMapperProps {
  headers: string[]
  onMappingComplete: (mapping: Record<string, string>) => void
  onCancel: () => void
}

export function ColumnMapper({ headers, onMappingComplete, onCancel }: ColumnMapperProps) {
  // Define the product fields that can be mapped
  const productFields = [
    {
      key: "name",
      label: "Product Name",
      required: true,
      description: "The name of the product",
    },
    {
      key: "slug",
      label: "Slug",
      required: false,
      description: "URL-friendly version of the name (auto-generated if empty)",
    },
    {
      key: "category",
      label: "Category",
      required: true,
      description: "Product category (must match an existing category)",
    },
    {
      key: "price",
      label: "Price",
      required: false,
      description: "Base price of the product (can be overridden by variants)",
    },
    {
      key: "description",
      label: "Description",
      required: true,
      description: "Detailed product description",
    },
    {
      key: "features",
      label: "Features",
      required: false,
      description: "Product features (semicolon separated)",
    },
    {
      key: "careInstructions",
      label: "Care Instructions",
      required: false,
      description: "Care instructions (semicolon separated)",
    },
    {
      key: "deliveryTime",
      label: "Delivery Time",
      required: false,
      description: "Expected delivery time (e.g., '2-3 weeks')",
    },
    {
      key: "returnPolicy",
      label: "Return Policy",
      required: false,
      description: "Return policy information",
    },
    {
      key: "warranty",
      label: "Warranty",
      required: false,
      description: "Warranty information",
    },
    {
      key: "inStock",
      label: "In Stock",
      required: false,
      description: "Whether the product is in stock (TRUE/FALSE)",
    },
    {
      key: "isWeeklyBestSeller",
      label: "Weekly Best Seller",
      required: false,
      description: "Featured as weekly best seller (TRUE/FALSE)",
    },
    {
      key: "materials",
      label: "Materials",
      required: false,
      description: "Available materials (semicolon separated)",
    },
    {
      key: "dimensions",
      label: "Dimensions",
      required: false,
      description: "Available dimensions (semicolon separated)",
    },
    {
      key: "materialDimensionPrices",
      label: "Material-Dimension Prices",
      required: false,
      description: "Format: Material|Dimension|Price|InStock (semicolon separated)",
    },
    {
      key: "addOns",
      label: "Add-ons",
      required: false,
      description: "Format: Name|Price (semicolon separated)",
    },
  ]

  // State for the column mapping
  const [mapping, setMapping] = useState<Record<string, string>>({})

  // Auto-map columns if headers match field names
  useEffect(() => {
    const initialMapping: Record<string, string> = {}

    productFields.forEach((field) => {
      // Try to find an exact match first
      const exactMatch = headers.find((header) => header.toLowerCase() === field.key.toLowerCase())

      if (exactMatch) {
        initialMapping[field.key] = exactMatch
      } else {
        // Try to find a partial match
        const partialMatch = headers.find((header) => header.toLowerCase().includes(field.key.toLowerCase()))

        if (partialMatch) {
          initialMapping[field.key] = partialMatch
        }
      }
    })

    setMapping(initialMapping)
  }, [headers])

  // Check if all required fields are mapped
  const isValid = productFields.filter((field) => field.required).every((field) => mapping[field.key])

  // Handle mapping change
  const handleMappingChange = (field: string, value: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle completion
  const handleComplete = () => {
    onMappingComplete(mapping)
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle>Map Excel Columns to Product Fields</CardTitle>
        <CardDescription>
          Select which Excel column corresponds to each product field. Required fields are marked with an asterisk (*).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productFields.map((field) => (
            <div
              key={field.key}
              className="space-y-2 p-3 rounded-md border bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Label htmlFor={`field-${field.key}`} className="flex-grow flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{field.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>

                {mapping[field.key] ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mapped
                  </Badge>
                ) : field.required ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Optional
                  </Badge>
                )}
              </div>
              <Select value={mapping[field.key] || ""} onValueChange={(value) => handleMappingChange(field.key, value)}>
                <SelectTrigger id={`field-${field.key}`} className="bg-white">
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
      </CardContent>
      <CardFooter className="flex justify-between bg-slate-50 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleComplete} disabled={!isValid}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
