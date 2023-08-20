FROM node:16
COPY ["package.json","package-lock.json","ts-config.json","/usr/uv/app/"]
WORKDIR /usr/uv/app
RUN npm install
COPY [".","/usr/org/app/"]
RUN npm run build
EXPOSE ${API_PORT}
CMD ["dist/index.js"]