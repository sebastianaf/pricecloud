FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

ENV API_JWT_SECRET
ENV API_JWT_EXPIRATION_TIME
ENV DB_HOST
ENV DB_PORT
ENV DB_NAME
ENV DB_USER
ENV DB_PASSWORD
ENV DB_SECRET
ENV DB_IV
ENV ENV

ENV API_JWT_SECRET $API_JWT_SECRET
ENV API_JWT_EXPIRATION_TIME $API_JWT_EXPIRATION_TIME
ENV DB_HOST $DB_HOST
ENV DB_PORT $DB_PORT
ENV DB_NAME $DB_NAME
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_SECRET $DB_SECRET
ENV DB_IV $DB_IV
ENV ENV $ENV

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