terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  
  backend "s3" {
    bucket = "knossos-terraform-state-lesholikov"
    key    = "knossos/terraform.tfstate"
    region = "eu-central-1"
  }
}


# Configure provider
provider "aws" {
  region = "eu-central-1"
}
