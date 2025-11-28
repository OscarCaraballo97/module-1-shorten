export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateLongURL(url: string): ValidationResult {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL must be a string" }
  }

  if (url.length > 2048) {
    return { valid: false, error: "URL is too long (max 2048 characters)" }
  }

  try {
    const urlObj = new URL(url)

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return { valid: false, error: "URL must use http or https protocol" }
    }

    return { valid: true }
  } catch {
    return { valid: false, error: "Invalid URL format" }
  }
}
