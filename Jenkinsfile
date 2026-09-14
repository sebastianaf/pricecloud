pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
        timeout(time: 40, unit: 'MINUTES')
    }

    environment {
        PROJECT_NAME = 'pricecloud'
        SSH_OPTS = '-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR'
        // Fuerza a Compose a cargar solo el compose base: si algun dia se anade
        // un docker-compose.local.yml y el .env trae COMPOSE_FILE apuntando a
        // ambos, produccion no debe arrastrar el override local.
        REMOTE_COMPOSE_FILE = 'COMPOSE_FILE=docker-compose.yml'
    }

    stages {

        stage('Setup') {
            steps {
                script {
                    echo "Branch: ${env.BRANCH_NAME}"

                    // Solo main despliega. Cualquier otra rama del multibranch
                    // falla aqui a proposito, antes de tocar el host remoto.
                    //
                    // APP_ENV tiene que ser uno de local|dev|prod: api-01 valida
                    // ENV con Joi contra ese enum (src/common/interfaces/
                    // environment.interface.ts) y no arranca con otro valor.
                    // DEPLOY_ENV solo nombra la credencial en Jenkins; se deja
                    // separado para poder anadir entornos sin tocar lo demas.
                    switch (env.BRANCH_NAME) {
                        case 'main':
                            env.APP_ENV = 'prod'
                            env.DEPLOY_ENV = 'prod'
                            break
                        default:
                            error "Branch '${env.BRANCH_NAME}' is not configured for deployment"
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh '''
                    set -e
                    curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b ./.grype-bin
                    ./.grype-bin/grype dir:. \
                        --exclude '**/node_modules/**' \
                        --exclude '**/build/**' \
                        --exclude '**/dist/**' \
                        --exclude '**/.grype-bin/**' \
                        --fail-on high \
                        -o table
                '''
            }
        }

        stage('Load Config') {
            steps {
                withCredentials([file(credentialsId: "${PROJECT_NAME}-env-${env.DEPLOY_ENV}", variable: 'ENV_FILE')]) {
                    // Antes de construir nada: una variable que falte no falla de
                    // forma ruidosa, Compose la sustituye por cadena vacia y sigue.
                    sh 'sh scripts/check-env.sh "$ENV_FILE"'

                    script {
                        withEnv(["SECRET_PATH=${ENV_FILE}"]) {
                            env.DEPLOY_USER = sh(
                                script: 'grep "^DEPLOY_USER=" "$SECRET_PATH" | cut -d= -f2- | tr -d \'"\'',
                                returnStdout: true
                            ).trim()
                            env.DEPLOY_DIR = sh(
                                script: 'grep "^DEPLOY_DIR=" "$SECRET_PATH" | cut -d= -f2- | tr -d \'"\'',
                                returnStdout: true
                            ).trim()
                        }

                        // Gateway del bridge de Docker: la IP del anfitrion en el
                        // que corre Jenkins.
                        env.DEPLOY_HOST = sh(
                            script: '''
                                awk 'function h2d(h,  r,i,c) {
                                         r=0
                                         for(i=1;i<=length(h);i++) {
                                             c=tolower(substr(h,i,1))
                                             r=r*16+(c~/[0-9]/?c+0:index("abcdef",c)+9)
                                         }
                                         return r
                                     }
                                     NR>1 && $2=="00000000" {
                                         printf "%d.%d.%d.%d\\n",
                                             h2d(substr($3,7,2)),
                                             h2d(substr($3,5,2)),
                                             h2d(substr($3,3,2)),
                                             h2d(substr($3,1,2))
                                         exit
                                     }' /proc/net/route
                            ''',
                            returnStdout: true
                        ).trim()

                        if (!env.DEPLOY_USER) {
                            error "Missing DEPLOY_USER in .env secret file"
                        }
                        if (!env.DEPLOY_DIR) {
                            error "Missing DEPLOY_DIR in .env secret file"
                        }
                        if (!env.DEPLOY_HOST) {
                            error "Could not detect host IP from /proc/net/route"
                        }

                        echo "==========================================="
                        echo "Environment: ${env.APP_ENV}"
                        echo "Deploy User: ${env.DEPLOY_USER}"
                        echo "Deploy Host: ${env.DEPLOY_HOST} (bridge gateway)"
                        echo "Deploy Dir:  ${env.DEPLOY_DIR}"
                        echo "==========================================="
                    }
                }
            }
        }

        stage('Validate') {
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        echo "Host reachable" &&
                        docker version --format "Docker {{.Server.Version}}" &&
                        docker compose version --short &&
                        git --version
                    '
                """
            }
        }

        stage('Pull') {
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        if [ -d "${DEPLOY_DIR}/.git" ]; then
                            echo "Repository exists, pulling latest changes..."
                            cd ${DEPLOY_DIR} &&
                            git fetch origin ${env.BRANCH_NAME} &&
                            git reset --hard origin/${env.BRANCH_NAME} &&
                            echo "Repository updated to origin/${env.BRANCH_NAME}"
                        else
                            echo "Repository not found, cloning..." &&
                            mkdir -p ${DEPLOY_DIR} &&
                            git clone --branch ${env.BRANCH_NAME} ${GIT_URL} ${DEPLOY_DIR} &&
                            echo "Repository cloned at ${DEPLOY_DIR}"
                        fi
                    '
                """
            }
        }

        stage('Config') {
            steps {
                sh "ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} 'rm -f ${DEPLOY_DIR}/.env'"

                withCredentials([file(credentialsId: "${PROJECT_NAME}-env-${env.DEPLOY_ENV}", variable: 'ENV_FILE')]) {
                    sh """
                        scp ${SSH_OPTS} \
                            ${ENV_FILE} \
                            ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/.env
                        echo ".env file deployed"
                    """
                }
            }
        }

        stage('Build') {
            parallel {
                stage('Build api-01') {
                    steps { script { buildService('api-01') } }
                }
                stage('Build api-02') {
                    steps { script { buildService('api-02') } }
                }
                stage('Build api-03') {
                    steps { script { buildService('api-03') } }
                }
                stage('Build ui') {
                    steps { script { buildService('ui') } }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        set -e
                        cd ${DEPLOY_DIR}

                        echo "Stopping existing services..."
                        ENV=${env.APP_ENV} ${REMOTE_COMPOSE_FILE} docker compose down --remove-orphans --timeout 30 || true

                        echo "Deploying services..."
                        ENV=${env.APP_ENV} ${REMOTE_COMPOSE_FILE} docker compose up -d --remove-orphans

                        echo "Services deployed"
                        ENV=${env.APP_ENV} ${REMOTE_COMPOSE_FILE} docker compose ps
                    '
                """
            }
        }

        stage('Migrate') {
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        cd ${DEPLOY_DIR} && sh scripts/app-run.sh ${env.APP_ENV} npm run migrations:run:prod
                    '
                """
            }
        }

        stage('Seed') {
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        cd ${DEPLOY_DIR} && sh scripts/app-run.sh ${env.APP_ENV} npm run seed:prod
                    '
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        cd ${DEPLOY_DIR} && sh scripts/health-check.sh ${env.APP_ENV}
                    '
                """
            }
        }

        stage('Cleanup') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh """
                    ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                        echo "Cleaning up old images..."

                        for svc in api-01 api-02 api-03 ui; do
                            docker images "${PROJECT_NAME}-${env.APP_ENV}-\${svc}" \
                                --format "table {{.CreatedAt}}\\t{{.ID}}\\t{{.Tag}}" | grep "backup-" | \
                                awk "NR>4{print \\\$2}" | \
                                xargs -r docker rmi --force 2>/dev/null || true
                        done

                        docker image prune -af --filter "until=72h"
                        echo "Cleanup completed"
                    '
                """
            }
        }

    }

    post {
        success {
            script {
                if (env.DEPLOY_USER && env.DEPLOY_HOST && env.DEPLOY_DIR) {
                    sh "ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} 'rm -f ${DEPLOY_DIR}/.env' || true"
                }
            }
            echo "Deploy to ${env.APP_ENV} (${env.BRANCH_NAME}) completed successfully"
        }
        failure {
            // Un fallo del Health Check cuenta como fallo del pipeline, asi que
            // dispara el mismo rollback automatico que un fallo de
            // Deploy/Migrate: la version recien desplegada no se queda en
            // produccion si no responde.
            echo "Deploy to ${env.APP_ENV} (${env.BRANCH_NAME}) failed"
            script {
                if (env.DEPLOY_USER && env.DEPLOY_HOST && env.DEPLOY_DIR) {
                    sh """
                        ssh ${SSH_OPTS} ${DEPLOY_USER}@${DEPLOY_HOST} '
                            echo "Attempting rollback..."
                            cd ${DEPLOY_DIR}
                            for svc in api-01 api-02 api-03 ui; do
                                docker tag ${PROJECT_NAME}-${env.APP_ENV}-\${svc}:backup-${BUILD_NUMBER} \
                                    ${PROJECT_NAME}-${env.APP_ENV}-\${svc}:latest 2>/dev/null || true
                            done
                            ENV=${env.APP_ENV} ${REMOTE_COMPOSE_FILE} docker compose up -d || true
                            rm -f ${DEPLOY_DIR}/.env
                        ' || true
                    """
                }
            }
        }
    }
}

// Respalda la imagen actual del servicio y la reconstruye. El tag
// backup-<build> es lo que usa el rollback de post.failure.
void buildService(String service) {
    // Todo por env.*: dentro de un metodo del script los bindings sueltos
    // (PROJECT_NAME, BUILD_NUMBER...) que si funcionan en los bloques `steps`
    // no estan garantizados.
    def image = "${env.PROJECT_NAME}-${env.APP_ENV}-${service}"

    sh """
        ssh ${env.SSH_OPTS} ${env.DEPLOY_USER}@${env.DEPLOY_HOST} '
            set -e
            cd ${env.DEPLOY_DIR}

            echo "Backing up ${service} image..."
            docker tag ${image}:latest ${image}:backup-${env.BUILD_NUMBER} 2>/dev/null || true

            echo "Building ${service} image..."
            ENV=${env.APP_ENV} ${env.REMOTE_COMPOSE_FILE} docker compose --progress=quiet build ${env.PROJECT_NAME}-${service}
            echo "${service} image built"
        '
    """
}
