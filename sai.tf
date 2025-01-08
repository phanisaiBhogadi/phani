provider "aws" {
  region = "us-east-1"
}


resource "aws_instance" "one" {
  ami           = "ami-0aa117785d1c1bfe5"
  instance_type = "t2.micro"
  tags = {
    Name = kissikraja
  }
}
