pipeline {
    agent {
        kubernetes {
            // نحدد الحاوية الافتراضية بشكل صريح لحل مشكلة "process never started"
            defaultContainer 'kubectl'
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
    - cat
    tty: true
  volumes:
    - name: docker-config
      secret:
        secretName: docker-config
'''
        }
    }
    environment {
        DOCKER_IMAGE = "zizoo1566/node-app" // تأكد من اسم المستخدم والصورة
    }
    stages {
        stage('Checkout') {
            steps {
                // سيتم تنفيذ هذا الأمر في الحاوية الافتراضية (kubectl)
                git branch: 'main', url: 'https://github.com/ztr1566/node_project.git'
            }
        }
        stage('Build and Push Image') {
            steps {
                // نتجاوز الحاوية الافتراضية ونستخدم kaniko لهذه المرحلة فقط
                container('kaniko') {
                    sh '''
                    /kaniko/executor --context `pwd` --destination ${DOCKER_IMAGE}:${BUILD_ID}
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                // سيتم تنفيذ هذا الأمر في الحاوية الافتراضية (kubectl)
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