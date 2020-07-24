FROM node:14
WORKDIR /app

COPY . /app
RUN npm install

EXPOSE 3307

CMD node proxyServer/proxyServer.js
