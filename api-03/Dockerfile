FROM python:3.11

WORKDIR /app

# Los requirements primero, para que la capa de dependencias se cachee y no se
# reinstale con cada cambio de codigo.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV API03_PORT=8080
EXPOSE ${API03_PORT}

# Forma exec con `sh -c ... exec`: hace falta un shell para expandir API03_PORT
# (antes el puerto estaba fijo a 8080 aqui mientras api-01 llamaba a
# http://${API03_HOST}:${API03_PORT}), pero el `exec` reemplaza al shell por
# waitress para que reciba SIGTERM directamente.
#
# Sin el `exec`, waitress queda como hijo de /bin/sh, que no reenvia la senal:
# `docker compose down` esperaba los 30s completos de timeout y luego lo mataba,
# anadiendo esa espera a cada despliegue.
CMD ["sh", "-c", "exec waitress-serve --port=${API03_PORT} run:app"]
