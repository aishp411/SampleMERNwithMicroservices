pipeline {
    agent any
    
    environment {
        // AWS / Docker credentials (if using ECR)
        AWS_REGION = "ca-central-1"
        ECR_REPO_FRONTEND = "aws_account_id.dkr.ecr.ca-central-1.amazonaws.com/ash/frontend"
        ECR_REPO_HELLO = "your-ecr-repo/helloService"
        ECR_REPO_PROFILE = "your-ecr-repo/profileService"
    }

    triggers {
        githubPush()   // 🔁 Auto-trigger when GitHub push happens
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }

        stage('Build Backend - helloService') {
            steps {
                dir('backend/helloService') {
                    echo '⚙️ Installing dependencies for helloService...'
                    sh 'npm install'
                }
            }
        }

        stage('Build Backend - profileService') {
            steps {
                dir('backend/profileService') {
                    echo '⚙️ Installing dependencies for profileService...'
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo '⚙️ Building frontend React app...'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    echo '🐳 Building Docker images...'
                    sh '''
                    docker build -t hello-service:latest backend/helloService
                    docker build -t profile-service:latest backend/profileService
                    docker build -t frontend:latest frontend
                    '''

                    echo '🔑 Logging in to AWS ECR...'
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_FRONTEND
                    '''

                    echo '📤 Tagging & Pushing images...'
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
        }

        stage('Post-Build Cleanup') {
            steps {
                echo '🧹 Cleaning up local Docker images...'
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
