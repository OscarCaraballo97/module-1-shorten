variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "url-shortener-v2"
}

variable "environment" {
  description = "Environment (dev, prod)"
  type        = string
  default     = "dev"
} 

variable "base_url" {
  description = "Base URL for short links"
  type        = string
  default     = "https://4sxlb64vig.execute-api.us-east-1.amazonaws.com"
}

variable "lambda_zip_path" {
  description = "Ruta al archivo ZIP del código de la Lambda generado por el CI/CD"
  type        = string
}