FROM node:16
COPY [".","/usr/org/app/"]
WORKDIR /usr/uv/app
RUN npm install
RUN npm run build
EXPOSE ${UI_PORT}
CMD ["npm", "run", "start"]