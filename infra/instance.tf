resource "aws_instance" "my_vm" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.knossos_sg.id]

  tags = {
    Name = "knossos instance"
  }
}
