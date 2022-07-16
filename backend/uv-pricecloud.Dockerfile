FROM node:16
COPY ["package.json","package-lock.json","/org/app/"]
WORKDIR /uv/app
RUN npm install
COPY [".","/uv/app/"]
RUN npm run build
EXPOSE ${API_PORT}
CMD ["npm", "start"]
