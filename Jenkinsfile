pipeline {
    agent {
        kubernetes {
            // نستخدم Pod بسيط بحاوية واحدة فقط ونقوم بتمرير Docker socket الخاص بالـ Host
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:20.10.17-alpine
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
        DOCKER_IMAGE = "zizoo1566/node-app" // تأكد من اسم المستخدم والصورة
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Prepare Environment') {
            steps {
                // نقوم بتثبيت الأدوات اللازمة داخل الحاوية
                sh '''
                apk add --no-cache curl git
                echo "--- Installing kubectl ---"
                curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
                '''
            }
        }
        stage('Build and Push Image') {
            steps {
                // *** هذا هو التصحيح ***
                // يجب وضع الأوامر المعقدة داخل script block
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        def customImage = docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                        customImage.push()
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "sed -i 's|\\${DOCKER_IMAGE}|${DOCKER_IMAGE}|g' kubernetes/deployment.yaml"
                    sh "sed -i 's|\\${BUILD_ID}|${env.BUILD_ID}|g' kubernetes/deployment.yaml"
                    
                    sh 'kubectl apply -f kubernetes/deployment.yaml'
                    sh 'kubectl rollout status deployment/node-app-deployment'
                }
            }
        }
    }
}