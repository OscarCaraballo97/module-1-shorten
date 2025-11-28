import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { createURLHandler } from "./handlers/createURL"
import { corsHeaders } from "./utils/cors"

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  console.log(" Received event:", JSON.stringify(event, null, 2))

  // 🔹 Soportar tanto API Gateway REST (v1) como HTTP API (v2)
  const method =
    event.httpMethod || // REST API v1
    event.requestContext?.http?.method // HTTP API v2
  
  const normalizedMethod = (method || "").toUpperCase()

  try {
    // Handle CORS preflight
    if (normalizedMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: "",
      }
    }

    // Only accept POST method
    if (normalizedMethod !== "POST") {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Method not allowed" }),
      }
    }

    // Process the request
    const result = await createURLHandler(event as APIGatewayProxyEvent)
    return {
      ...result,
      headers: { ...result.headers, ...corsHeaders },
    }
  } catch (error) {
    console.error(" Unexpected error:", error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    }
  }
}
