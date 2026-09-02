resource "aws_db_subnet_group" "knossos_db_subnet" {
  name       = "knossos-db-subnet"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "knossos-db-subnet"
  }
}

resource "aws_db_instance" "knossos_db" {
  identifier             = "knossos-db"
  engine                 = "postgres"
  engine_version         = "18"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  db_name                = "tds_wrhs"
  username               = "postgres"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.knossos_db_subnet.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = {
    Name = "knossos-db"
  }
}