pipeline {
    agent any

    environment {
        
        AWS_REGION = "ca-central-1"
        ECR_REGISTRY = "123456789012.dkr.ecr.ca-central-1.amazonaws.com"
        ECR_REPO_FRONTEND = "${ECR_REGISTRY}/ash/frontend"
        ECR_REPO_HELLO = "${ECR_REGISTRY}/ash/helloservice"
        ECR_REPO_PROFILE = "${ECR_REGISTRY}/ash/profileservice"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Checking out source code..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images..."
                sh '''
                docker build -t hello-service:latest backend/helloService
                docker build -t profile-service:latest backend/profileService
                docker build -t frontend:latest frontend
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                echo "🔑 Logging in to AWS ECR..."
                withCredentials([usernamePassword(credentialsId: 'aishwarya-aws-accesskey', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }

        stage('Push Docker Images to ECR') {
            steps {
                echo "📤 Tagging and pushing Docker images..."
                sh '''
                docker tag hello-service:latest $ECR_REPO_HELLO:latest
                docker tag profile-service:latest $ECR_REPO_PROFILE:latest
                docker tag frontend:latest $ECR_REPO_FRONTEND:latest

                docker push $ECR_REPO_HELLO:latest
                docker push $ECR_REPO_PROFILE:latest
                docker push $ECR_REPO_FRONTEND:latest
                '''
            }
        }

        stage('Post-Build Cleanup') {
            steps {
                echo "🧹 Cleaning up local Docker images..."
                sh 'docker system prune -f'
            }
        }
    }

    post {
        success {
            echo '✅ Build and Push Successful!'
        }
        failure {
            echo '❌ Build Failed!'
        }
    }
}
