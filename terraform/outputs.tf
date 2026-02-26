output "ec2_public_ip"    { value = aws_instance.server.public_ip }
output "jenkins_url"      { value = "http://${aws_instance.server.public_ip}:8080" }
output "todo_service_url" { value = "http://${aws_instance.server.public_ip}:8081" }
output "user_service_url" { value = "http://${aws_instance.server.public_ip}:8082" }
output "frontend_url"     { value = "http://${aws_instance.server.public_ip}:3000" }
output "grafana_url"      { value = "http://${aws_instance.server.public_ip}:3001" }
output "ssh_command"      { value = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.server.public_ip}" }
