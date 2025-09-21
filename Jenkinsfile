pipeline {
    agent {
        kubernetes {
            // Defines a pod with two containers: one for docker, one for kubectl
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:20.10.16-dind # Use docker-in-docker image
    command:
    - cat
    tty: true
    securityContext:
      privileged: true # Required for Docker-in-Docker
  - name: kubectl
    image: lachlanevenson/k8s-kubectl:v1.28.2
    command:
    - cat
    tty: true
'''
        }
    }
    environment {
        DOCKER_IMAGE = "zizoo1566/node-app" 
    }
    stages {
        stage('Checkout') {
            steps {
                // This step runs in the default 'jnlp' container
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                // Explicitly run these steps inside the 'docker' container
                container('docker') {
                    script {
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                            def customImage = docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                            customImage.push()
                        }
                    }
                }
            }
        }
        stage('Deploy to K3s') {
            steps {
                // Explicitly run these steps inside the 'kubectl' container
                container('kubectl') {
                    // Use the kubeconfig credential
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        script {
                            // The envsubst command is not available, so we use sed as an alternative
                            sh "sed -i 's|\\${DOCKER_IMAGE}|${DOCKER_IMAGE}|g' kubernetes/deployment.yaml"
                            sh "sed -i 's|\\${BUILD_ID}|${env.BUILD_ID}|g' kubernetes/deployment.yaml"
                            sh 'kubectl apply -f kubernetes/deployment.yaml'
                            sh 'kubectl rollout status deployment/node-app-deployment'
                        }
                    }
                }
            }
        }
    }
}