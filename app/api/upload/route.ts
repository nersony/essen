import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    // Parse the form data
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' }, 
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, 
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum file size is 5MB.' }, 
        { status: 400 }
      )
    }

    // Generate a unique filename
    const fileExtension = path.extname(image.name)
    const uniqueFileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(uploadDir, uniqueFileName)

    // Convert file to buffer
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to uploads directory
    await fs.writeFile(filePath, buffer)

    // Construct the public URL for the uploaded image
    const imageUrl = `/uploads/${uniqueFileName}`

    return NextResponse.json({ 
      message: 'Image uploaded successfully', 
      imageUrl 
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

// Ensure the route can handle larger file uploads
export const config = {
  api: {
    bodyParser: false
  }
}