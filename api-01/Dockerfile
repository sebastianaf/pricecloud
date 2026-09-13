# Contexto de build: la RAIZ del repo, no ./api-01.
# El repo es un npm workspace: el package-lock.json y el bloque `overrides`
# (que es lo que mantiene el arbol sin vulnerabilidades) viven solo en la
# raiz. Instalando desde ./api-01 no hay lockfile -- `npm ci` fallaba -- y
# `npm install` resolveria versiones nuevas sin overrides, asi que las
# vulnerabilidades volverian dentro de la imagen.
FROM node:22-alpine AS builder

ENV NODE_ENV=build

# /home/node ya existe y pertenece a node; un WORKDIR nuevo lo crearia root y
# npm no podria escribir.
USER node
WORKDIR /home/node

# Manifiestos primero, para que la capa de dependencias se cachee y no se
# reinstale con cada cambio de codigo.
COPY --chown=node:node package.json package-lock.json ./
# npm ci valida el lockfile completo: tienen que estar los package.json de
# TODOS los workspaces, aunque solo se instalen las dependencias de api-01.
COPY --chown=node:node api-01/package.json ./api-01/
COPY --chown=node:node api-02/package.json ./api-02/
COPY --chown=node:node ui/package.json ./ui/
RUN npm ci -w pricecloud-api --include-workspace-root

COPY --chown=node:node api-01/ ./api-01/
RUN npm run build -w pricecloud-api

# Reinstalar en vez de `npm prune`: con workspaces, prune deja enlaces
# colgando entre la raiz y api-01/node_modules. `npm ci --omit=dev` parte del
# mismo lockfile y da un arbol de produccion determinista.
RUN npm ci --omit=dev -w pricecloud-api --include-workspace-root

FROM node:22-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

# Se conserva la estructura de workspace del builder: node_modules/pricecloud-api
# es un symlink a ./api-01 y la resolucion de modulos sube de
# api-01/node_modules a /home/node/node_modules.
COPY --from=builder --chown=node:node /home/node/package.json ./package.json
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
# Incluye dist/, package.json, src/ (TypeORM lee los fuentes para resolver
# metadatos de entidades) y api-01/node_modules.
COPY --from=builder --chown=node:node /home/node/api-01/ ./api-01/

WORKDIR /home/node/api-01

ARG API_PORT
EXPOSE ${API_PORT}

CMD ["npm", "run", "start:prod"]
