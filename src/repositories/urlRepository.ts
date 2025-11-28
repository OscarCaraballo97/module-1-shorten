import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

export interface URLRecord {
  code: string
  longUrl: string
  createdAt: string
  totalClicks: number
  lastClickAt?: string
}

export class URLRepository {
  private docClient: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    const client = new DynamoDBClient({})
    this.docClient = DynamoDBDocumentClient.from(client)
    this.tableName = process.env.DYNAMODB_TABLE || "url_shortener"
  }

  async create(record: URLRecord): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `URL#${record.code}`,
        SK: "METADATA",
        code: record.code,
        longUrl: record.longUrl,
        createdAt: record.createdAt,
        totalClicks: record.totalClicks,
        GSI1PK: `LONGURL#${record.longUrl}`,
        GSI1SK: record.createdAt,
      },
    })

    await this.docClient.send(command)
  }

  async findByCode(code: string): Promise<URLRecord | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `URL#${code}`,
        SK: "METADATA",
      },
    })

    const result = await this.docClient.send(command)

    if (!result.Item) {
      return null
    }

    return result.Item as URLRecord
  }


  async findByLongURL(longUrl: string): Promise<URLRecord | null> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :gsi1pk",
      ExpressionAttributeValues: {
        ":gsi1pk": `LONGURL#${longUrl}`,
      },
      Limit: 1,
    })

    const result = await this.docClient.send(command)
    return result.Items && result.Items.length > 0 ? (result.Items[0] as URLRecord) : null
  }

  async existsByCode(code: string): Promise<boolean> {
    const record = await this.findByCode(code)
    return record !== null
  }
}
