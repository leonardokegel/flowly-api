FROM node:10

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . .

ENV APP_PORT 8080

EXPOSE 8080

CMD [ "node", "server.js" ]