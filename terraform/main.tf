terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" { region = var.aws_region }

# ── VPC ────────────────────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "${var.project}-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = { Name = "${var.project}-subnet" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project}-igw" }
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.main.id
  route { cidr_block = "0.0.0.0/0"; gateway_id = aws_internet_gateway.igw.id }
}

resource "aws_route_table_association" "rta" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.rt.id
}

# ── Security Group ──────────────────────────────────────────────────────────────
resource "aws_security_group" "sg" {
  name   = "${var.project}-sg"
  vpc_id = aws_vpc.main.id

  # SSH
  ingress { from_port = 22;   to_port = 22;   protocol = "tcp"; cidr_blocks = [var.my_ip]; description = "SSH" }
  # Jenkins
  ingress { from_port = 8080; to_port = 8080; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]; description = "Jenkins" }
  # Todo Service
  ingress { from_port = 8081; to_port = 8081; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]; description = "Todo API" }
  # User Service
  ingress { from_port = 8082; to_port = 8082; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]; description = "User API" }
  # Frontend
  ingress { from_port = 3000; to_port = 3000; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]; description = "Frontend" }
  # Grafana
  ingress { from_port = 3001; to_port = 3001; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]; description = "Grafana" }
  # Prometheus
  ingress { from_port = 9090; to_port = 9090; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]; description = "Prometheus" }
  # All outbound
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }

  tags = { Name = "${var.project}-sg" }
}

# ── EC2 ─────────────────────────────────────────────────────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter { name = "name"; values = ["ubuntu/images/hvm-ssd/ubuntu-22.04-amd64-server-*"] }
}

resource "aws_key_pair" "key" {
  key_name   = "${var.project}-key"
  public_key = file(var.public_key_path)
}

resource "aws_instance" "server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.sg.id]
  key_name               = aws_key_pair.key.key_name
  user_data              = file("${path.module}/userdata.sh")

  root_block_device {
    volume_size = 25
    volume_type = "gp3"
  }

  tags = {
    Name        = "${var.project}-server"
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
