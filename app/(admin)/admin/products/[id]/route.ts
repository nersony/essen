// app/api/products/[id]/route.ts
import { NextResponse } from "next/server"
import { getProductById } from "@/app/actions/product-actions"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id)
    
    if (!product) {
      return new NextResponse(null, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return new NextResponse(null, { status: 500 })
  }
}