#!/bin/sh
# Ejecuta un comando de api-01 (migraciones, seed) en un contenedor EFIMERO, no
# dentro del contenedor de la app que ya esta corriendo. Lo invocan los stages
# "Migrate" y "Seed" del Jenkinsfile.
#
# Por que no `docker exec` sobre pricecloud-<env>-api-01:
# api-01 lleva `restart: always`. Si el contenedor se reinicia mientras el exec
# esta en marcha, Docker mata el proceso del exec con SIGKILL y el comando
# devuelve 137. Es decir: si la app esta en bucle de reinicio, las migraciones
# mueren con un codigo criptico que no dice nada de la causa real.
#
# Un contenedor efimero (`docker compose run --rm`) no hereda la politica de
# reinicio, no depende de que la app arranque bien y sobrevive a que api-01 se
# reinicie a mitad. Las migraciones solo necesitan la base de datos, que el
# compose ya espera con `condition: service_healthy`.
#
# Uso: sh scripts/app-run.sh <env> <comando...>
#   p.ej. sh scripts/app-run.sh prod npm run migrations:run:prod

set -e

APP_ENV="$1"
if [ -z "$APP_ENV" ]; then
  echo "ERROR: falta el argumento <env>" >&2
  exit 2
fi
shift

if [ $# -eq 0 ]; then
  echo "ERROR: falta el comando a ejecutar" >&2
  exit 2
fi

PROJECT_NAME=pricecloud
SERVICE="${PROJECT_NAME}-api-01"
CONTAINER="${PROJECT_NAME}-${APP_ENV}-api-01"

export ENV="$APP_ENV"
export COMPOSE_FILE=docker-compose.yml

echo "Ejecutando en contenedor efimero de ${SERVICE}: $*"

# -T: sin TTY, la sesion ssh de Jenkins no lo tiene.
# --no-deps: la base de datos ya esta levantada por el stage Deploy.
# Capturado con set +e y no con `if ...; then`: tras un `if`, $? es el estado
# del propio `if` (siempre 0), no el del comando de la condicion, y el fallo se
# propagaria como exito.
set +e
docker compose run --rm --no-deps -T "$SERVICE" "$@"
STATUS=$?
set -e

if [ "$STATUS" -eq 0 ]; then
  exit 0
fi

echo "" >&2
echo "ERROR: '$*' fallo con codigo ${STATUS}" >&2
echo "--- estado del contenedor de la app (${CONTAINER}) ---" >&2
# RestartCount alto u OOMKilled=true explican la mayoria de los fallos raros
# aqui: si la app esta en bucle de reinicio o la maquina se queda sin memoria,
# el sintoma aparece en este comando y no en la salida del propio comando.
docker inspect "$CONTAINER" \
  --format 'RestartCount={{.RestartCount}} OOMKilled={{.State.OOMKilled}} Status={{.State.Status}} ExitCode={{.State.ExitCode}}' >&2 2>/dev/null \
  || echo "(no se pudo inspeccionar ${CONTAINER})" >&2
echo "--- ultimas 40 lineas de ${CONTAINER} ---" >&2
docker logs --tail 40 "$CONTAINER" >&2 2>&1 || true

exit "$STATUS"
