pipeline {
    agent {
        kubernetes {
            // Defines a pod with two OFFICIAL containers: one for docker, one for kubectl
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:20.10-dind # Official Docker-in-Docker image
    command:
    - cat
    tty: true
    securityContext:
      privileged: true
  - name: kubectl
    image: bitnami/kubectl:1.28 # Official and verified kubectl image
    command:
    - cat
    tty: true
'''
        }
    }
    environment {
        // تأكد أن هذا هو اسم المستخدم واسم الصورة الصحيحين
        DOCKER_IMAGE = "zizoo1566/node-app"
    }
    stages {
        stage('Checkout') {
            steps {
                // This step runs in the default container
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                // Run these steps inside the 'docker' container
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
                // Run these steps inside the 'kubectl' container
                container('kubectl') {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        script {
                            // Replace variables in the deployment file
                            sh "sed -i 's|\\${DOCKER_IMAGE}|${DOCKER_IMAGE}|g' kubernetes/deployment.yaml"
                            sh "sed -i 's|\\${BUILD_ID}|${env.BUILD_ID}|g' kubernetes/deployment.yaml"

                            // Apply the configuration
                            sh 'kubectl apply -f kubernetes/deployment.yaml'
                            sh 'kubectl rollout status deployment/node-app-deployment'
                        }
                    }
                }
            }
        }
    }
}