pipeline {
    agent {
        kubernetes {
            // نستخدم Pod مخصص بصورة Ubuntu قياسية لضمان الموثوقية
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker
  - name: ubuntu-tools
    image: ubuntu:20.04
    command:
    - sleep
    args:
    - 99d
  volumes:
    - name: docker-config
      secret:
        secretName: docker-config
'''
        }
    }
    environment {
        DOCKER_IMAGE = "zizoo1566/node-app"
    }
    stages {
        stage('Checkout') {
            steps {
                // يعمل في الحاوية الافتراضية
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Build and Push Image') {
            steps {
                // يعمل داخل حاوية Kaniko
                container('kaniko') {
                    sh '''
                    /kaniko/executor --context `pwd` --destination ${DOCKER_IMAGE}:${BUILD_ID}
                    '''
                }
            }
        }
        stage('Install Tools and Deploy') {
            steps {
                // يعمل داخل حاوية Ubuntu المضمونة
                container('ubuntu-tools') {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        sh '''
                        echo "--- Installing kubectl ---"
                        apt-get update && apt-get install -y curl
                        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                        install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
                        
                        echo "--- Applying deployment ---"
                        sed -i 's|\\${DOCKER_IMAGE}|${DOCKER_IMAGE}|g' kubernetes/deployment.yaml
                        sed -i 's|\\${BUILD_ID}|${env.BUILD_ID}|g' kubernetes/deployment.yaml
                        
                        kubectl apply -f kubernetes/deployment.yaml
                        kubectl rollout status deployment/node-app-deployment
                        '''
                    }
                }
            }
        }
    }
}