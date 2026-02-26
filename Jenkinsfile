pipeline {
    agent any

    environment {
        DOCKER_HUB_USER  = "your-dockerhub-username"
        TODO_IMAGE       = "todo-service"
        USER_IMAGE       = "user-service"
        FRONTEND_IMAGE   = "todo-frontend"
        BUILD_TAG        = "${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {

        // ── 1. CHECKOUT ────────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${GIT_BRANCH} | Build: #${BUILD_NUMBER}"
            }
        }

        // ── 2. TEST: both microservices in parallel ─────────────────────────────
        stage('Test Services') {
            parallel {
                stage('Test Todo Service') {
                    steps {
                        dir('services/todo-service') {
                            sh 'mvn test -Dspring.profiles.active=test -q'
                            echo "Todo Service tests PASSED"
                        }
                    }
                    post {
                        always { junit 'services/todo-service/target/surefire-reports/*.xml' }
                    }
                }
                stage('Test User Service') {
                    steps {
                        dir('services/user-service') {
                            sh 'mvn test -Dspring.profiles.active=test -q'
                            echo "User Service tests PASSED"
                        }
                    }
                    post {
                        always { junit 'services/user-service/target/surefire-reports/*.xml' }
                    }
                }
            }
        }

        // ── 3. BUILD: both JARs in parallel ────────────────────────────────────
        stage('Build Services') {
            parallel {
                stage('Build Todo JAR') {
                    steps {
                        dir('services/todo-service') {
                            sh 'mvn clean package -DskipTests -q'
                            echo "Todo Service JAR built"
                        }
                    }
                }
                stage('Build User JAR') {
                    steps {
                        dir('services/user-service') {
                            sh 'mvn clean package -DskipTests -q'
                            echo "User Service JAR built"
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci --silent && npm run build'
                            echo "React frontend built"
                        }
                    }
                }
            }
        }

        // ── 4. DOCKER BUILD ─────────────────────────────────────────────────────
        stage('Build Docker Images') {
            steps {
                sh "docker build -t ${DOCKER_HUB_USER}/${TODO_IMAGE}:${BUILD_TAG} services/todo-service/"
                sh "docker tag  ${DOCKER_HUB_USER}/${TODO_IMAGE}:${BUILD_TAG} ${DOCKER_HUB_USER}/${TODO_IMAGE}:latest"

                sh "docker build -t ${DOCKER_HUB_USER}/${USER_IMAGE}:${BUILD_TAG} services/user-service/"
                sh "docker tag  ${DOCKER_HUB_USER}/${USER_IMAGE}:${BUILD_TAG} ${DOCKER_HUB_USER}/${USER_IMAGE}:latest"

                sh "docker build -t ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${BUILD_TAG} frontend/"
                sh "docker tag  ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${BUILD_TAG} ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"

                echo "3 Docker images built — tag: ${BUILD_TAG}"
            }
        }

        // ── 5. PUSH to Docker Hub ───────────────────────────────────────────────
        stage('Push Images') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${DOCKER_HUB_USER}/${TODO_IMAGE}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_HUB_USER}/${TODO_IMAGE}:latest"
                    sh "docker push ${DOCKER_HUB_USER}/${USER_IMAGE}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_HUB_USER}/${USER_IMAGE}:latest"
                    sh "docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_HUB_USER}/${FRONTEND_IMAGE}:latest"
                }
                echo "All 3 images pushed to Docker Hub"
            }
        }

        // ── 6. DEPLOY to EC2 ────────────────────────────────────────────────────
        stage('Deploy to EC2') {
            when { branch 'main' }
            steps {
                withCredentials([
                    string(credentialsId: 'ec2-host', variable: 'HOST'),
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEY')
                ]) {
                    sh '''
                        ssh -i $KEY -o StrictHostKeyChecking=no ubuntu@$HOST << DEPLOY
                            cd /home/ubuntu/todo-multiservice-cicd
                            git pull origin main
                            docker-compose pull todo-service user-service frontend
                            docker-compose up -d --no-deps todo-service user-service frontend
                            docker image prune -f
                            echo "Deployed build #''' + env.BUILD_TAG + '''"
DEPLOY
                    '''
                }
                echo "Deployment complete!"
            }
        }

        // ── 7. HEALTH CHECK: both services ─────────────────────────────────────
        stage('Health Check') {
            when { branch 'main' }
            steps {
                withCredentials([string(credentialsId: 'ec2-host', variable: 'HOST')]) {
                    script {
                        retry(5) {
                            sleep(time: 10, unit: 'SECONDS')
                            sh 'curl -sf http://$HOST:8081/actuator/health | grep -q UP'
                            sh 'curl -sf http://$HOST:8082/actuator/health | grep -q UP'
                            echo "Both services are healthy!"
                        }
                    }
                }
            }
        }

    } // end stages

    post {
        success {
            echo "BUILD #${BUILD_NUMBER} SUCCESS — both services deployed and healthy"
        }
        failure {
            echo "BUILD #${BUILD_NUMBER} FAILED — check logs above"
        }
        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
