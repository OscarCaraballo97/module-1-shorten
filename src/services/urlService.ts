import { URLRepository } from "../repositories/urlRepository"
import { generateShortCode } from "../utils/codeGenerator"

export interface ShortURLResult {
  code: string
  shortUrl: string
  longUrl: string
  createdAt: string
}

export class URLService {
  private repository: URLRepository

  constructor() {
    this.repository = new URLRepository()
  }

  async createShortURL(longUrl: string): Promise<ShortURLResult> {
    // Check if URL already exists
    const existingURL = await this.repository.findByLongURL(longUrl)
    if (existingURL) {
      const baseUrl = process.env.SHORT_URL_BASE || "https://4sxlb64vig.execute-api.us-east-1.amazonaws.com"
      return {
        code: existingURL.code,
        shortUrl: `${baseUrl}/${existingURL.code}`,
        longUrl: existingURL.longUrl,
        createdAt: existingURL.createdAt,
      }
    }

    // Generate unique short code
    let code: string
    let attempts = 0
    const maxAttempts = 10

    do {
      code = generateShortCode()
      const exists = await this.repository.existsByCode(code)
      if (!exists) break
      attempts++
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      throw new Error("Failed to generate unique code")
    }

    // Save to database
    const createdAt = new Date().toISOString()
    await this.repository.create({
      code,
      longUrl,
      createdAt,
      totalClicks: 0,
    })

    const baseUrl = process.env.SHORT_URL_BASE || "https://4sxlb64vig.execute-api.us-east-1.amazonaws.com"
    return {
      code,
      shortUrl: `${baseUrl}/${code}`,
      longUrl,
      createdAt,
    }
  }
}
