import * as XLSX from "xlsx"
import { z } from "zod"
import type { ProductFormData, Category } from "@/lib/db/schema"

// Define the expected Excel column structure
export const productExcelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  features: z.string().optional(), // Will be split by delimiter
  careInstructions: z.string().optional(), // Will be split by delimiter
  deliveryTime: z.string().optional(),
  warranty: z.string().optional(),
  inStock: z.union([z.boolean(), z.string()]).optional(),
  isWeeklyBestSeller: z.union([z.boolean(), z.string()]).optional(),
  // Simplified variant related fields
  materials: z.string().optional(), // Semicolon separated material names
  dimensions: z.string().optional(), // Semicolon separated dimension values
  materialDimensionPrices: z.string().optional(), // Format: "Material|Dimension|Price|InStock" semicolon separated
  addOns: z.string().optional(), // Format: "Name|Price" semicolon separated
})

export type ProductExcelRow = z.infer<typeof productExcelSchema>

// Define the placeholder image URL
export const PLACEHOLDER_IMAGE_URL =
  "https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/products/placeholder.png"

// Generate a slug from a name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Parse Excel file and return rows with sheet selection
export async function parseExcelFile(file: File): Promise<{
  headers: string[]
  rows: any[]
  errors: string[]
  sheets: string[]
  selectedSheet?: string
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const errors: string[] = []

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Get all sheet names
        const sheets = workbook.SheetNames

        if (sheets.length === 0) {
          errors.push("Excel file contains no sheets")
          resolve({ headers: [], rows: [], errors, sheets: [] })
          return
        }

        // Default to the second sheet if it exists, otherwise use the first sheet
        const selectedSheet = sheets.length > 1 ? sheets[1] : sheets[0]
        const worksheet = workbook.Sheets[selectedSheet]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          errors.push("Excel sheet must contain at least a header row and one data row")
          resolve({ headers: [], rows: [], errors, sheets, selectedSheet })
          return
        }

        // Extract headers and rows
        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1)

        resolve({ headers, rows, errors, sheets, selectedSheet })
      } catch (error) {
        errors.push(`Failed to parse Excel file: ${error.message}`)
        resolve({ headers: [], rows: [], errors, sheets: [] })
      }
    }

    reader.onerror = () => {
      errors.push("Error reading the file")
      resolve({ headers: [], rows: [], errors, sheets: [] })
    }

    reader.readAsArrayBuffer(file)
  })
}

// Function to parse a specific sheet from an Excel file
export async function parseExcelSheet(
  file: File,
  sheetName: string,
): Promise<{
  headers: string[]
  rows: any[]
  errors: string[]
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const errors: string[] = []

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Check if the requested sheet exists
        if (!workbook.SheetNames.includes(sheetName)) {
          errors.push(`Sheet "${sheetName}" not found in the Excel file`)
          resolve({ headers: [], rows: [], errors })
          return
        }

        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          errors.push(`Sheet "${sheetName}" must contain at least a header row and one data row`)
          resolve({ headers: [], rows: [], errors })
          return
        }

        // Extract headers and rows
        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1)

        resolve({ headers, rows, errors })
      } catch (error) {
        errors.push(`Failed to parse Excel file: ${error.message}`)
        resolve({ headers: [], rows: [], errors })
      }
    }

    reader.onerror = () => {
      errors.push("Error reading the file")
      resolve({ headers: [], rows: [], errors })
    }

    reader.readAsArrayBuffer(file)
  })
}

// Convert Excel row to product data
export function convertRowToProductData(
  row: Record<string, any>,
  columnMapping: Record<string, string>,
  categories: Category[],
): {
  productData: Partial<ProductFormData>
  errors: string[]
} {
  const errors: string[] = []
  const productData: Partial<ProductFormData> = {}

  // Map each field based on the column mapping
  Object.entries(columnMapping).forEach(([productField, excelColumn]) => {
    if (!excelColumn || excelColumn === "none") return // Skip if no column is mapped

    const value = row[excelColumn]

    try {
      switch (productField) {
        case "name":
          productData.name = String(value || "")
          // Auto-generate slug if not provided
          if (!productData.slug && productData.name) {
            productData.slug = generateSlug(productData.name)
          }
          break

        case "slug":
          productData.slug = value ? String(value) : productData.name ? generateSlug(productData.name) : ""
          break

        case "category":
          productData.category = String(value || "")
          // Find the category ID for the selected category
          const selectedCategory = categories.find((c) => c.name === productData.category)
          if (selectedCategory) {
            productData.categoryId = selectedCategory.id
          } else {
            errors.push(`Category "${productData.category}" not found in the system`)
          }
          break

        case "price":
          productData.price = value ? Number(value) : undefined
          break

        case "description":
          productData.description = String(value || "")
          break

        case "features":
          productData.features = value
            ? String(value)
                .split(";")
                .map((f) => f.trim())
                .filter(Boolean)
            : [""]
          break

        case "careInstructions":
          productData.careInstructions = value
            ? String(value)
                .split(";")
                .map((c) => c.trim())
                .filter(Boolean)
            : [""]
          break

        case "deliveryTime":
          productData.deliveryTime = value ? String(value) : undefined
          break

        case "warranty":
          productData.warranty = value ? String(value) : undefined
          break

        case "inStock":
          if (typeof value === "boolean") {
            productData.inStock = value
          } else if (typeof value === "string") {
            const lowerValue = value.toLowerCase()
            productData.inStock = lowerValue === "true" || lowerValue === "yes" || lowerValue === "1"
          } else {
            productData.inStock = Boolean(value)
          }
          break

        case "isWeeklyBestSeller":
          if (typeof value === "boolean") {
            productData.isWeeklyBestSeller = value
          } else if (typeof value === "string") {
            const lowerValue = value.toLowerCase()
            productData.isWeeklyBestSeller = lowerValue === "true" || lowerValue === "yes" || lowerValue === "1"
          } else {
            productData.isWeeklyBestSeller = Boolean(value)
          }
          break

        case "materials":
          if (value) {
            const materialNames = String(value)
              .split(";")
              .map((m) => m.trim())
              .filter(Boolean)

            if (materialNames.length > 0) {
              if (!productData.variants) {
                productData.variants = [
                  {
                    materials: materialNames.map((name) => ({ name, description: "" })),
                    dimensions: [],
                    combinations: [],
                    addOns: [],
                  },
                ]
              } else {
                productData.variants[0].materials = materialNames.map((name) => ({ name, description: "" }))
              }
            }
          }
          break

        case "dimensions":
          if (value) {
            const dimensionValues = String(value)
              .split(";")
              .map((d) => d.trim())
              .filter(Boolean)

            if (dimensionValues.length > 0) {
              if (!productData.variants) {
                productData.variants = [
                  {
                    materials: [],
                    dimensions: dimensionValues.map((value) => ({ value, description: "" })),
                    combinations: [],
                    addOns: [],
                  },
                ]
              } else {
                productData.variants[0].dimensions = dimensionValues.map((value) => ({ value, description: "" }))
              }
            }
          }
          break

        case "materialDimensionPrices":
          if (value) {
            const combinations = String(value)
              .split(";")
              .map((combo) => {
                const [materialName, dimensionValue, priceStr, inStockStr] = combo.split("|").map((s) => s.trim())
                const price = Number(priceStr) || 0
                const inStock = inStockStr?.toLowerCase() === "true" || inStockStr?.toLowerCase() === "yes" || true

                return {
                  materialName,
                  dimensionValue,
                  price,
                  inStock,
                }
              })
              .filter((c) => c.materialName && c.dimensionValue)

            if (combinations.length > 0) {
              if (!productData.variants) {
                productData.variants = [
                  {
                    materials: [],
                    dimensions: [],
                    combinations,
                    addOns: [],
                  },
                ]
              } else {
                productData.variants[0].combinations = combinations
              }
            }
          }
          break

        case "addOns":
          if (value) {
            const addOns = String(value)
              .split(";")
              .map((addon) => {
                const [name, priceStr] = addon.split("|").map((s) => s.trim())
                return {
                  name,
                  price: Number(priceStr) || 0,
                  selected: false,
                }
              })
              .filter((a) => a.name)

            if (addOns.length > 0) {
              if (!productData.variants) {
                productData.variants = [
                  {
                    materials: [],
                    dimensions: [],
                    combinations: [],
                    addOns,
                  },
                ]
              } else {
                productData.variants[0].addOns = addOns
              }
            }
          }
          break

        default:
          // Handle unknown fields
          break
      }
    } catch (error) {
      errors.push(`Error processing field ${productField}: ${error.message}`)
    }
  })

  // Set default images with the new placeholder
  productData.images = [PLACEHOLDER_IMAGE_URL]

  return { productData, errors }
}

// Generate a sample Excel template with formatting
export function generateExcelTemplate(): Uint8Array {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Define the headers
  const headers = [
    "name",
    "slug",
    "category",
    "price",
    "description",
    "features",
    "careInstructions",
    "deliveryTime",
    "warranty",
    "inStock",
    "isWeeklyBestSeller",
    "materials",
    "dimensions",
    "materialDimensionPrices",
    "addOns",
  ]

  // Create a sample row
  const sampleRow = [
    "Modern Sofa",
    "modern-sofa",
    "Living Room",
    1299.99,
    "A comfortable modern sofa for your living room.",
    "Durable construction;Easy to clean;Eco-friendly materials",
    "Vacuum regularly;Spot clean with mild soap",
    "2-3 weeks",
    "2-year warranty",
    "TRUE",
    "FALSE",
    "Fabric;Leather",
    "2600mm;3000mm",
    "Fabric|2600mm|1299.99|true;Fabric|3000mm|1499.99|true;Leather|2600mm|1599.99|true;Leather|3000mm|1799.99|true",
    "Metal Frame|200;Premium Cushions|150",
  ]

  // Create the worksheet data
  const wsData = [headers, sampleRow]

  // Create the worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Add cell formatting
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:P2")

  // Add header formatting
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ r: 0, c: C })
    if (!ws[cell_address]) continue

    // Make headers bold with light gray background
    ws[cell_address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "EEEEEE" } },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    }
  }

  // Add data validation for boolean fields
  const booleanCols = ["J", "K"] // inStock, isWeeklyBestSeller
  for (const col of booleanCols) {
    ws[`${col}2`] = { t: "b", v: true }

    // Add data validation for TRUE/FALSE
    if (!ws["!dataValidation"]) ws["!dataValidation"] = []
    ws["!dataValidation"].push({
      sqref: `${col}2:${col}1000`,
      type: "list",
      formula1: '"TRUE,FALSE"',
    })
  }

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, ws, "Products")

  // Generate the Excel file
  return XLSX.write(workbook, { type: "array", bookType: "xlsx", bookSST: false })
}

// Helper function to create a formatted Excel template with instructions
export function generateFormattedTemplate(categories: Category[]): Uint8Array {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Create instructions worksheet
  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ["Product Import Template Instructions"],
    [""],
    ["This template helps you import products into the system. Please follow these guidelines:"],
    [""],
    ["1. Do not modify the header row (first row)"],
    ["2. Each row represents one product"],
    ["3. Required fields: name, category, description"],
    ["4. For fields with multiple values (features, materials, etc.), separate values with semicolons (;)"],
    ["5. For variant pricing, use the format: Material|Dimension|Price|InStock (e.g., 'Fabric|2600mm|1299.99|true')"],
    ["6. For add-ons, use the format: Name|Price (e.g., 'Metal Frame|200')"],
    ["7. Boolean fields (inStock, isWeeklyBestSeller) should be TRUE or FALSE"],
    ["8. Images will be set to the default placeholder and must be uploaded separately after import"],
    [""],
    ["Available Categories:"],
    ...categories.map((category) => [category.name]),
  ])

  // Style the instructions
  const instructionsRange = XLSX.utils.decode_range(instructionsWs["!ref"] || "A1:A15")

  // Style the title
  instructionsWs["A1"].s = {
    font: { bold: true, sz: 14 },
    alignment: { horizontal: "left" },
  }

  // Style the category list header
  instructionsWs["A13"].s = {
    font: { bold: true },
    alignment: { horizontal: "left" },
  }

  // Add the instructions worksheet
  XLSX.utils.book_append_sheet(workbook, instructionsWs, "Instructions")

  // Define the headers for the template
  const headers = [
    "name",
    "slug",
    "category",
    "price",
    "description",
    "features",
    "careInstructions",
    "deliveryTime",
    "warranty",
    "inStock",
    "isWeeklyBestSeller",
    "materials",
    "dimensions",
    "materialDimensionPrices",
    "addOns",
  ]

  // Create a sample row
  const sampleRow = [
    "Modern Sofa",
    "modern-sofa",
    categories.length > 0 ? categories[0].name : "Living Room",
    1299.99,
    "A comfortable modern sofa for your living room.",
    "Durable construction;Easy to clean;Eco-friendly materials",
    "Vacuum regularly;Spot clean with mild soap",
    "2-3 weeks",
    "2-year warranty",
    "TRUE",
    "FALSE",
    "Fabric;Leather",
    "2600mm;3000mm",
    "Fabric|2600mm|1299.99|true;Fabric|3000mm|1499.99|true;Leather|2600mm|1599.99|true;Leather|3000mm|1799.99|true",
    "Metal Frame|200;Premium Cushions|150",
  ]

  // Create the template worksheet
  const templateWs = XLSX.utils.aoa_to_sheet([headers, sampleRow])

  // Add header formatting
  const range = XLSX.utils.decode_range(templateWs["!ref"] || "A1:P2")

  // Format headers
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ r: 0, c: C })
    if (!templateWs[cell_address]) continue

    templateWs[cell_address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F46E5" } }, // Indigo color
      alignment: { horizontal: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    }
  }

  // Add column widths
  const colWidths = [
    { wch: 20 }, // name
    { wch: 15 }, // slug
    { wch: 15 }, // category
    { wch: 10 }, // price
    { wch: 40 }, // description
    { wch: 40 }, // features
    { wch: 40 }, // careInstructions
    { wch: 15 }, // deliveryTime
    { wch: 15 }, // warranty
    { wch: 10 }, // inStock
    { wch: 15 }, // isWeeklyBestSeller
    { wch: 25 }, // materials
    { wch: 25 }, // dimensions
    { wch: 60 }, // materialDimensionPrices
    { wch: 30 }, // addOns
  ]

  templateWs["!cols"] = colWidths

  // Add the template worksheet
  XLSX.utils.book_append_sheet(workbook, templateWs, "Products Template")

  // Generate the Excel file
  return XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
    bookSST: false,
  })
}
