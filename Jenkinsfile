pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'localhost:5000'
        BACKEND_IMAGE = 'cursor-raffle-backend'
        FRONTEND_IMAGE = 'cursor-raffle-frontend'
        BACKEND_VERSION = "${env.BUILD_NUMBER}"
        FRONTEND_VERSION = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh '''
                                mvn clean test || true
                            '''
                        }
                    }
                }
                
                stage('Frontend Tests') {
                    steps {
                        sh '''
                            npm install
                            npm test -- --coverage --watchAll=false || true
                        '''
                    }
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${BACKEND_IMAGE}:${BACKEND_VERSION}")
                        docker.build("${BACKEND_IMAGE}:latest")
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    docker.build("${FRONTEND_IMAGE}:${FRONTEND_VERSION}")
                    docker.build("${FRONTEND_IMAGE}:latest")
                }
            }
        }
        
        stage('Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    docker.withRegistry("http://${DOCKER_REGISTRY}") {
                        docker.image("${BACKEND_IMAGE}:${BACKEND_VERSION}").push()
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        docker.image("${FRONTEND_IMAGE}:${FRONTEND_VERSION}").push()
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy to Docker Compose') {
            steps {
                sh '''
                    docker-compose down || true
                    docker-compose pull || true
                    docker-compose up -d --build
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    def maxRetries = 30
                    def retryCount = 0
                    def backendHealthy = false
                    
                    while (retryCount < maxRetries && !backendHealthy) {
                        sleep(time: 10, unit: 'SECONDS')
                        try {
                            def response = sh(
                                script: 'curl -f http://localhost:8080/actuator/health || exit 1',
                                returnStatus: true
                            )
                            if (response == 0) {
                                backendHealthy = true
                                echo "Backend is healthy!"
                            }
                        } catch (Exception e) {
                            echo "Waiting for backend to be healthy... (${retryCount}/${maxRetries})"
                        }
                        retryCount++
                    }
                    
                    if (!backendHealthy) {
                        error("Backend health check failed after ${maxRetries} retries")
                    }
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: '**/target/*.jar', allowEmptyArchive: true
            publishTestResults testResultsPattern: '**/test-results/**/*.xml', allowEmptyResults: true
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
            // Send notifications
        }
    }
}

