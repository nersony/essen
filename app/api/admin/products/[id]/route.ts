// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server"
import { getProductById } from "@/app/actions/product-actions"

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  console.log('=== DEBUG: Admin Product Route Handler Started ===')
  console.log('Request URL:', request.url)
  console.log('Params:', JSON.stringify(params, null, 2))

  try {
    // Ensure product ID is valid
    const productId = params.id

    console.log('Extracted Product ID:', productId)

    if (!productId) {
      console.error('ERROR: No product ID found')
      return new NextResponse(
        JSON.stringify({ 
          error: "Missing Product ID", 
          message: "No product ID was provided in the request." 
        }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch product
    const product = await getProductById(productId)
    
    // Product not found handling
    if (!product) {
      console.error(`ERROR: No product found with ID: ${productId}`)
      return new NextResponse(
        JSON.stringify({ 
          error: "Product Not Found", 
          message: `No product found with ID: ${productId}` 
        }), 
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Successful product retrieval
    console.log('Product successfully retrieved:', product.name)
    return NextResponse.json(product)
  } catch (error) {
    // Comprehensive error logging
    console.error('CRITICAL ERROR in admin product route handler:', error)

    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: "An unexpected error occurred while fetching the product.",
        debugDetails: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}