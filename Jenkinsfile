pipeline {
    agent {
        kubernetes {
            // We use a custom pod with reliable images
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
  - name: kubectl
    image: bitnami/kubectl:1.28
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
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Build and Push Image') {
            steps {
                container('kaniko') {
                    sh '''
                    /kaniko/executor --context `pwd` --destination ${DOCKER_IMAGE}:${BUILD_ID}
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                // This container has kubectl.
                // By removing withCredentials, kubectl will automatically use the
                // in-cluster service account to connect to the Kubernetes API.
                container('kubectl') {
                    script {
                        sh "sed -i 's|\\${DOCKER_IMAGE}|${DOCKER_IMAGE}|g' kubernetes/deployment.yaml"
                        sh "sed -i 's|\\${BUILD_ID}|${env.BUILD_ID}|g' kubernetes/deployment.yaml"

                        // This command will now succeed
                        sh 'kubectl apply -f kubernetes/deployment.yaml'
                        sh 'kubectl rollout status deployment/node-app-deployment'
                    }
                }
            }
        }
    }
}