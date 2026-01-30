pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'master',
                url: 'https://github.com/fullstacktraning/nodejs-deployment.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("node-laptop-app")
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    sh '''
                    docker rm -f node_app || true
                    '''
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh '''
                    docker run -d \
                    --name node_app \
                    -p 8000:8000 \
                    --env-file .env \
                    node-laptop-app
                    '''
                }
            }
        }
    }
}
