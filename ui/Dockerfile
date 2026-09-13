# Contexto de build: la RAIZ del repo (ver el comentario de api-01/Dockerfile).
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
# npm ci valida el lockfile completo: hacen falta los package.json de todos
# los workspaces, aunque solo se instalen las dependencias de ui.
COPY api-01/package.json ./api-01/
COPY api-02/package.json ./api-02/
COPY ui/package.json ./ui/
RUN npm ci -w pricecloud-ui --include-workspace-root

COPY ui/ ./ui/

# Toda NEXT_PUBLIC_* se incrusta como texto en el bundle del navegador
# durante `next build`; nunca se lee en runtime. Por eso tienen que llegar
# como build args y no basta con ponerlas en `environment:` del compose.
ARG NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_API_HOST=${NEXT_PUBLIC_API_HOST}
ARG NEXT_PUBLIC_UI_PORT
ENV NEXT_PUBLIC_UI_PORT=${NEXT_PUBLIC_UI_PORT}
ARG NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}

RUN npm run build -w pricecloud-ui

RUN npm ci --omit=dev -w pricecloud-ui --include-workspace-root

FROM node:22-alpine

ENV NODE_ENV=production
# Sin esto Next.js escucha solo en loopback y el contenedor queda inalcanzable.
ENV HOSTNAME=0.0.0.0

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
# next.config.js pone distDir: 'build', asi que el resultado de next build
# esta en ui/build, no en ui/.next.
COPY --from=builder /usr/src/app/ui/ ./ui/

WORKDIR /usr/src/app/ui

ARG UI_PORT
EXPOSE ${UI_PORT}

# `next start` lee PORT de forma nativa; UI_PORT solo se usaba para EXPOSE, asi
# que el contenedor escuchaba siempre en el 3000 por defecto. El compose pasa
# PORT=${UI_PORT}.
CMD ["npm", "run", "start"]
