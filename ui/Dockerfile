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


FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_API_HOST
RUN npm run build
EXPOSE ${UI_PORT}
CMD ["npm", "run", "start"]