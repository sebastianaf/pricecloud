# Contexto de build: la RAIZ del repo (ver el comentario de api-01/Dockerfile).
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
# npm ci valida el lockfile completo: hacen falta los package.json de todos
# los workspaces, aunque solo se instalen las dependencias de api-02.
COPY api-01/package.json ./api-01/
COPY api-02/package.json ./api-02/
COPY ui/package.json ./ui/
RUN npm ci -w cloud-pricing-api --include-workspace-root

COPY api-02/ ./api-02/
RUN npm run build -w cloud-pricing-api

# Arbol de produccion a partir del mismo lockfile, en un directorio aparte
# para copiarlo tal cual a la imagen final.
RUN cp -R node_modules /tmp/root_node_modules \
    && cp -R api-02/node_modules /tmp/ws_node_modules 2>/dev/null || true
RUN npm ci --omit=dev -w cloud-pricing-api --include-workspace-root

FROM node:22-alpine AS release

# bash/curl/postgresql-client los usan los comandos data:load y data:dump
# (pg_copy / restore de los dumps de precios).
RUN apk add --no-cache bash curl postgresql-client

WORKDIR /usr/src/app
RUN mkdir -p api-02/data/products

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules/ ./node_modules/
# Incluye dist/, views/public copiados por el postbuild y api-02/node_modules.
COPY --from=build /usr/src/app/api-02/ ./api-02/

RUN addgroup -g 1001 -S infracost \
    && adduser -u 1001 -S infracost -G infracost \
    && chown -R infracost:infracost /usr/src/app
USER 1001

WORKDIR /usr/src/app/api-02

ENV NODE_ENV=production
EXPOSE 4000
CMD ["npm", "run", "start"]
