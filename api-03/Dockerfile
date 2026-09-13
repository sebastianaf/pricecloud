FROM python:3.11

WORKDIR /app

# Los requirements primero, para que la capa de dependencias se cachee y no se
# reinstale con cada cambio de codigo.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Forma shell (no exec) a proposito: hace falta un shell para expandir
# API03_PORT. Antes el puerto estaba fijo a 8080 aqui mientras api-01 llamaba
# a http://${API03_HOST}:${API03_PORT}, asi que cualquier valor de API03_PORT
# distinto de 8080 en el .env rompia la comunicacion en silencio.
ENV API03_PORT=8080
EXPOSE ${API03_PORT}
CMD waitress-serve --port=${API03_PORT} run:app
