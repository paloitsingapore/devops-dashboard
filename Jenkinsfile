pipeline {
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker rmi devops-dashboard:latest -f"
                    sh "docker rmi devops-dashboard:1.0.0 -f"
                    sh "docker build -t devops-dashboard:1.0.0 -t devops-dashboard:latest ."
                }
            }
        }
        stage('Publish Docker Images') {
            steps {
                script {
                    docker.withRegistry('http://172.29.227.90:6555', '3f81323c-280c-4b0a-a809-aca14640fbe1') {
                        docker.image("devops-dashboard:1.0.0").push()
                        docker.image("devops-dashboard:latest").push()
                    }
                }
            }
        }
        stage('Start Docker Images') {
            steps {
                script {

                    docker.withRegistry('http://172.29.227.90:6555', '3f81323c-280c-4b0a-a809-aca14640fbe1') {
                        docker.image("devops-dashboard:latest").pull()
                    }
                    sh "docker-compose stop"
                    sh "docker-compose rm -v -f"
                    sh "docker-compose up -d"
                }
            }
        }
    }
}
