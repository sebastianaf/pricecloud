#!/bin/sh
# Comprueba que los servicios desplegados responden. Lo invoca el stage
# "Health Check" del Jenkinsfile por ssh sobre el host Docker.
#
# Vive en un script y no embebido en el Jenkinsfile a proposito: la
# comprobacion necesita tres niveles de anidamiento (sh de Jenkins -> ssh ->
# docker run) y escaparlo inline es una fuente segura de errores de comillas.
#
# Uso: sh scripts/health-check.sh <env>
#   p.ej. sh scripts/health-check.sh prod

set -e

APP_ENV="$1"
if [ -z "$APP_ENV" ]; then
  echo "ERROR: falta el argumento <env>" >&2
  exit 2
fi

PROJECT_NAME=pricecloud
NETWORK="${PROJECT_NAME}-${APP_ENV}"
API_CONTAINER="${PROJECT_NAME}-${APP_ENV}-api-01"
UI_CONTAINER="${PROJECT_NAME}-${APP_ENV}-ui"
MAX_RETRIES=20
RETRY_DELAY=5

# Los puertos se leen del entorno REAL de los contenedores ya desplegados, no
# reparseando el .env como texto: esta sesion ssh es nueva y no hereda nada de
# lo que exporta Compose.
API_PORT="$(docker exec "$API_CONTAINER" printenv API_PORT)"
UI_PORT="$(docker exec "$UI_CONTAINER" printenv PORT)"

echo "Health check en la red ${NETWORK} (api-01:${API_PORT}, ui:${UI_PORT})"

# curl desde dentro de la red del proyecto: los servicios no publican puertos
# al anfitrion, solo son alcanzables por nombre de servicio.
#
# api-01 se comprueba por codigo HTTP y no con `curl -sf` porque no expone
# ningun endpoint de salud: AppController no declara rutas y Swagger solo se
# monta cuando ENV != production (ver api-01/src/docs/docs.service.ts). Un 404
# ya demuestra que el proceso escucha y acepta conexiones, que es lo que se
# quiere verificar aqui.
i=1
while [ "$i" -le "$MAX_RETRIES" ]; do
  API_CODE="$(docker run --rm --network "$NETWORK" curlimages/curl:latest \
    -s -o /dev/null -w '%{http_code}' --max-time 5 \
    "http://${API_CONTAINER}:${API_PORT}/" 2>/dev/null || echo 000)"

  UI_CODE="$(docker run --rm --network "$NETWORK" curlimages/curl:latest \
    -s -o /dev/null -w '%{http_code}' --max-time 5 \
    "http://${UI_CONTAINER}:${UI_PORT}/login" 2>/dev/null || echo 000)"

  if [ "$API_CODE" != "000" ] && [ "$UI_CODE" = "200" ]; then
    echo "OK: api-01 responde (HTTP ${API_CODE}), ui responde (HTTP ${UI_CODE})"
    exit 0
  fi

  echo "Intento ${i}/${MAX_RETRIES}: api-01=${API_CODE} ui=${UI_CODE} (reintento en ${RETRY_DELAY}s)"
  i=$((i + 1))
  sleep "$RETRY_DELAY"
done

echo "ERROR: los servicios no respondieron tras ${MAX_RETRIES} intentos" >&2
echo "--- ultimas lineas de api-01 ---" >&2
docker logs --tail 30 "$API_CONTAINER" >&2 2>&1 || true
echo "--- ultimas lineas de ui ---" >&2
docker logs --tail 30 "$UI_CONTAINER" >&2 2>&1 || true
exit 1
