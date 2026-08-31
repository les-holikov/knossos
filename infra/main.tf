terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Configure provider
provider "aws" {
  region = "eu-central-1"
}
