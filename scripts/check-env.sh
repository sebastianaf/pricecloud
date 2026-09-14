#!/bin/sh
# Verifica que el .env traiga todas las variables que hacen falta, antes de
# construir nada. Lo invoca el stage "Load Config" del Jenkinsfile sobre el
# fichero de la credencial.
#
# Existe porque las variables que faltan no fallan de forma ruidosa: Compose
# solo avisa con "variable is not set. Defaulting to a blank string" y sigue
# adelante. El resultado es un despliegue roto que no se detecta hasta el
# final, o peor, que arranca y esta mal por dentro (ver NEXT_PUBLIC_API_HOST).
#
# Uso: sh scripts/check-env.sh <ruta-al-.env>

set -e

ENV_FILE="$1"
if [ -z "$ENV_FILE" ]; then
  echo "ERROR: falta el argumento <ruta-al-.env>" >&2
  exit 2
fi
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: no existe $ENV_FILE" >&2
  exit 2
fi

# Lee el valor de una variable del .env.
#
# El `tr -d '\r'` no es opcional: la credencial se edita en Windows y llega con
# finales de linea CRLF, asi que sin el ENV valdria "prod\r" y no casaria con
# "prod". (Docker y Compose si limpian el CR por su cuenta, o sea que el
# problema era solo de este script.) Git Bash en Windows tampoco lo reproduce
# porque normaliza al leer; el agente de Jenkins es Linux y ahi si aparece.
#
# El resto normaliza como lo hace Compose: quita un comentario inline solo si
# va precedido de espacio (para no partir un valor que contenga '#', como una
# contrasena), recorta espacios alrededor y quita las comillas envolventes.
read_var() {
  grep "^${1}=" "$ENV_FILE" 2>/dev/null \
    | head -1 \
    | cut -d= -f2- \
    | tr -d '\r' \
    | sed -e 's/[[:space:]][[:space:]]*#.*$//' \
          -e 's/^[[:space:]]*//' \
          -e 's/[[:space:]]*$//' \
          -e 's/^"\(.*\)"$/\1/' \
          -e "s/^'\\(.*\\)'\$/\\1/"
}

# Interpoladas por docker-compose.yml: si faltan, Compose las sustituye por
# cadena vacia y el servicio arranca mal configurado.
COMPOSE_VARS="ENV TZ API_PORT DB_USER DB_PASSWORD DB_NAME DB2_USER DB2_PASSWORD DB2_NAME API02_PORT API03_PORT UI_PORT NEXT_PUBLIC_API_HOST"

# Requeridas por el esquema Joi de api-01 y NO sobreescritas por el compose,
# asi que tienen que venir del .env via env_file. DB_HOST, DB_PORT, API02_HOST
# y API03_HOST no estan aqui: el compose las fija con los nombres de servicio.
API01_VARS="API_JWT_SECRET API_JWT_EXPIRATION_TIME API_COOKIE_EXPIRATION_TIME API_COOKIE_DOMAIN DB_SECRET DB_IV EMAIL_HOST EMAIL_PORT EMAIL_USER EMAIL_PASSWORD COMMON_SECRET COMMON_IV"

# Las lee el propio Jenkinsfile para saber donde desplegar.
DEPLOY_VARS="DEPLOY_USER DEPLOY_DIR"

MISSING=""
for var in $COMPOSE_VARS $API01_VARS $DEPLOY_VARS; do
  if [ -z "$(read_var "$var")" ]; then
    MISSING="${MISSING} ${var}"
  fi
done

if [ -n "$MISSING" ]; then
  echo "ERROR: al .env le faltan variables requeridas (o las tiene vacias):" >&2
  for var in $MISSING; do
    echo "  - $var" >&2
  done
  echo "" >&2
  echo "Anadelas a la credencial 'Secret file' de Jenkins. Plantilla: .env.example" >&2
  exit 1
fi

# ENV tiene que ser uno de local|dev|prod: api-01 lo valida con Joi contra el
# enum de src/common/interfaces/environment.interface.ts y no arranca con otro
# valor (ojo: 'production' NO vale, el enum mapea production = 'prod').
ENV_VALUE="$(read_var ENV)"
case "$ENV_VALUE" in
  local|dev|prod) ;;
  *)
    echo "ERROR: ENV='${ENV_VALUE}' no es valido; api-01 solo acepta local, dev o prod" >&2
    exit 1
    ;;
esac

# El codigo del frontend hace `https://${NEXT_PUBLIC_API_HOST}` y
# `wss://${NEXT_PUBLIC_API_HOST}/price`, o sea que el valor va como host pelado.
# Con esquema queda "https://https://..." y las llamadas a la API fallan en el
# navegador, sin que el build se entere.
API_HOST_VALUE="$(read_var NEXT_PUBLIC_API_HOST)"
case "$API_HOST_VALUE" in
  http://*|https://*|ws://*|wss://*)
    echo "ERROR: NEXT_PUBLIC_API_HOST='${API_HOST_VALUE}' no debe llevar esquema." >&2
    echo "El frontend ya antepone https:// y wss://; pon solo el host (p.ej. api.pricecloud.org)" >&2
    exit 1
    ;;
esac

echo "OK: el .env trae todas las variables requeridas (ENV=${ENV_VALUE})"
