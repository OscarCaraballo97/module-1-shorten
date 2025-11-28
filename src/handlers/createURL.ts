import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { URLService } from "../services/urlService"
import { validateLongURL } from "../utils/validation"

export const createURLHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Request body is required" }),
      }
    }

    const body = JSON.parse(event.body)
    const { longUrl } = body

    // Validate input
    if (!longUrl) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "longUrl is required" }),
      }
    }

    // Validate URL format
    const validation = validateLongURL(longUrl)
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: validation.error }),
      }
    }

    // Create shortened URL
    const urlService = new URLService()
    const result = await urlService.createShortURL(longUrl)

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: result.code,
        shortUrl: result.shortUrl,
        longUrl: result.longUrl,
        createdAt: result.createdAt,
      }),
    }
  } catch (error) {
    console.error(" Error in createURLHandler:", error)

    if (error instanceof Error && error.message.includes("already exists")) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: error.message }),
      }
    }

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to create short URL" }),
    }
  }
}
