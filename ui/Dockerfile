FROM node:16
WORKDIR /usr/uv/app
COPY ["./ui","/usr/org/app/"]
RUN npm install
RUN npm run build
EXPOSE ${UI_PORT}
CMD ["npm", "run", "start"]