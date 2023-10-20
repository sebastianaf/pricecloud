pipeline {
  agent any
  tools {
    nodejs 'node-14'
  }

  options {
    timeout(time: 5, unit: 'MINUTES')
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh 'cd api-01 && npm install'
      }
    }
    stage('Create build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}