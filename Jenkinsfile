pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:20.10.16
    command:
    - cat
    tty: true
    volumeMounts:
    - name: docker-socket
      mountPath: /var/run/docker.sock
  volumes:
  - name: docker-socket
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }
    environment {
        DOCKER_IMAGE = "zizoo1566/node-app" // Your DockerHub username/image name
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
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        def customImage = docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                        customImage.push()
                    }
                }
            }
        }
        stage('Deploy to K3s') {
            steps {
                // The kubectl command is now available because we installed it on the Master Node
                script {
                    sh "envsubst < kubernetes/deployment.yaml | kubectl apply -f -"
                    sh "kubectl rollout status deployment/node-app-deployment"
                }
            }
        }
    }
}