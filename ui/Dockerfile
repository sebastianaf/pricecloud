#FROM node:16-alpine as builder
#
#ENV NODE_ENV build
#
#USER node
#WORKDIR /home/node
#
#COPY package*.json ./
#RUN npm ci
#
#COPY --chown=node:node . .
#RUN npm run build \
    #&& npm prune --production
#
#FROM node:16-alpine
#
#ENV NODE_ENV production
#
#USER node
#WORKDIR /home/node
#
#COPY --from=builder --chown=node:node /home/node/package*.json ./
#COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
#COPY --from=builder --chown=node:node /home/node/public/ ./public/
#COPY --from=builder --chown=node:node /home/node/.next/ ./.next/
#
#EXPOSE ${UI_PORT}
#CMD ["npm", "run", "start"]

# Establece el nodo base
FROM node:16-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

EXPOSE ${UI_PORT}
CMD ["npm", "run", "start"]