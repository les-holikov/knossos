resource "aws_key_pair" "deployer" {
  key_name   = "knossos-key"
  public_key = file("~/.ssh/knossos-key.pub")
}
