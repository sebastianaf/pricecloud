FROM node:16
COPY ["package.json","package-lock.json","/usr/uv/app/"]
WORKDIR /usr/uv/app
RUN npm install
COPY [".","/usr/org/app/"]
RUN npm run build


EXPOSE ${UI_PORT}
CMD ["npm", "run", "start"]