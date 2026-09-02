output "instance_public_ip" {
  value = aws_instance.my_vm.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.knossos_db.endpoint
}