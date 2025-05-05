/**
 * Utility functions for handling image URLs
 */

/**
 * Ensures an image URL uses the correct DigitalOcean Spaces path
 * @param url The original image URL
 * @returns The updated image URL with the correct path
 */
export function ensureCorrectImagePath(url: string): string {
    if (!url) return url
  
    // If it's already using the correct path, return as is
    if (url.includes("assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen")) {
      return url
    }
  
    // If it's using the old DO Spaces path without /essen, update it
    if (url.includes("assets-xyzap.sgp1.cdn.digitaloceanspaces.com")) {
      // Extract the filename from the old path
      const filename = url.split("/").pop()
      if (filename) {
        return `https://assets-xyzap.sgp1.cdn.digitaloceanspaces.com/essen/${filename}`
      }
    }
  
    // For local or other URLs, return as is
    return url
  }
  
  /**
   * Migrates an array of image URLs to use the correct DigitalOcean Spaces path
   * @param images Array of image URLs
   * @returns Updated array with correct paths
   */
  export function migrateImageUrls(images: string[]): string[] {
    return images.map(ensureCorrectImagePath)
  }
  