output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.shorten_lambda.arn
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.shorten_lambda.function_name
}

output "lambda_role_arn" {
  description = "ARN of the Lambda IAM role"
  value       = aws_iam_role.lambda_role.arn
}

output "api_route" {
  description = "API Gateway route"
  value       = aws_apigatewayv2_route.shorten_route.route_key
}
