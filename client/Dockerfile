FROM node:12 as node

RUN mkdir -p /app

WORKDIR /app

COPY . /app
RUN npm install
RUN npm run build

FROM nginx:1.13.7-alpine

COPY --from=node /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
