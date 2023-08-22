FROM node:16-alpine as builder
ARG ENV_FILE

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production


RUN echo ${API_JWT_SECRET}
RUN echo ${API_JWT_EXPIRATION_TIME}
RUN echo ${DB_HOST}
RUN echo ${DB_PORT}
RUN echo ${DB_NAME}
RUN echo ${DB_USER}
RUN echo ${DB_PASSWORD}
RUN echo ${DB_SECRET}
RUN echo ${DB_IV}
RUN echo ${ENV}

RUN printenv

RUN npm run seed

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/


EXPOSE ${API_PORT}
CMD ["npm", "run", "start:prod"]