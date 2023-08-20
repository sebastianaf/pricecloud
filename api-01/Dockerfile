#FROM node:16
#COPY ["package.json","package-lock.json","ts-config.json","/usr/uv/app/"]
#WORKDIR /usr/uv/app
#RUN npm install
#COPY [".","/usr/org/app/"]
#RUN npm run build
#EXPOSE ${API_PORT}
#CMD ["npm","run","start:prod"]

FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/


EXPOSE ${API_PORT}
CMD ["npm", "run", "start:prod"]