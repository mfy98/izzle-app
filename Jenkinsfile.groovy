pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
        nodejs 'NodeJS-20'
    }
    
    environment {
        DOCKER_REGISTRY = credentials('docker-registry-url')
        KUBECONFIG = credentials('kubeconfig')
        BACKEND_IMAGE = 'cursor-raffle-backend'
        FRONTEND_IMAGE = 'cursor-raffle-frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Lint & Format Check') {
            steps {
                sh 'npm run lint || true'
            }
        }
        
        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    sh 'mvn clean install -DskipTests=false'
                    archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Frontend Build & Test') {
            steps {
                sh '''
                    npm install
                    npm test -- --coverage --watchAll=false
                '''
                publishTestResults testResultsPattern: 'coverage/**/*.xml', allowEmptyResults: true
            }
            post {
                always {
                    publishCoverage adapters: [
                        coberturaAdapter('coverage/cobertura-coverage.xml')
                    ]
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            script {
                                def backendImage = docker.build("${BACKEND_IMAGE}:${env.BUILD_NUMBER}")
                                backendImage.tag("${BACKEND_IMAGE}:latest")
                            }
                        }
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        script {
                            def frontendImage = docker.build("${FRONTEND_IMAGE}:${env.BUILD_NUMBER}")
                            frontendImage.tag("${FRONTEND_IMAGE}:latest")
                        }
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    docker.withRegistry("${DOCKER_REGISTRY}") {
                        docker.image("${BACKEND_IMAGE}:${env.BUILD_NUMBER}").push()
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        docker.image("${FRONTEND_IMAGE}:${env.BUILD_NUMBER}").push()
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                        sh '''
                            kubectl apply -k k8s/
                            kubectl rollout status deployment/backend -n cursor-raffle
                            kubectl rollout status deployment/frontend -n cursor-raffle
                        '''
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    def maxRetries = 30
                    def retryCount = 0
                    
                    while (retryCount < maxRetries) {
                        sleep(time: 10, unit: 'SECONDS')
                        try {
                            def response = sh(
                                script: 'curl -f http://localhost:8080/actuator/health || exit 1',
                                returnStatus: true
                            )
                            if (response == 0) {
                                echo "Health check passed!"
                                break
                            }
                        } catch (Exception e) {
                            echo "Health check attempt ${retryCount}/${maxRetries}"
                        }
                        retryCount++
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded! ✅'
            // Slack notification
        }
        failure {
            echo 'Pipeline failed! ❌'
            // Slack notification
        }
    }
}

