pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKER_IMAGE = 'zizoo1566/node-app'
        KUBECONFIG = credentials('kubeconfig')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS) {
                        def customImage = docker.build(DOCKER_IMAGE + ":${env.BUILD_ID}")
                        customImage.push()
                    }
                }
            }
        }
        stage('Deploy to K3s') {
            steps {
                script {
                    sh 'envsubst < kubernetes/deployment.yaml | kubectl apply -f -'
                    sh 'kubectl rollout status deployment/node-app-deployment'
                }
            }
        }
    }
}
