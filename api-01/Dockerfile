FROM node:16
COPY ["package.json","package-lock.json","/usr/uv/app/"]
WORKDIR /usr/uv/app
RUN npm install
RUN ls -la
COPY [".","/usr/org/app/"]
RUN ls -la
RUN npm run build
EXPOSE ${API_PORT}
CMD ["dist/index.js"]