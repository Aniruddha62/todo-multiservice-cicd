variable "aws_region"      { default = "us-east-1";         description = "AWS region" }
variable "project"         { default = "todo-multiservice"; description = "Project name used for tagging" }
variable "instance_type"   { default = "t3.medium";         description = "EC2 instance type" }
variable "environment"     { default = "production";        description = "Environment name" }
variable "my_ip"           { default = "0.0.0.0/0";         description = "Your IP for SSH access (x.x.x.x/32)" }
variable "public_key_path" { default = "~/.ssh/id_rsa.pub"; description = "Path to your SSH public key" }
