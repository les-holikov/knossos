variable "db_password" {
  description = "RDS Postgres master password"
  type        = string
  sensitive   = true
}