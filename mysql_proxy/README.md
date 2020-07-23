# Node MySQL proxy server

## Usage

> Make sure that the database has been migrated beforehand

Start the proxy server locally wihthout docker
```bash
node src/proxyServer.js
```

## Setup

### Environment variables using a .env file

```
HOST=0.0.0.0
DB_HOST=host.docker.internal (or use localhost)
DB_USER=bob
DB_PASS=banana
DB_NAME=social_network
DB_PORT=32000 (or use 3306 for default)
DB_PORT_FORWARDED=3307
AES_SQL_KEY=...
AES_SQL_NONCE=...
```

> Make sure to turn SSL off for MySQL ssl=0


## Build

```bash
docker-compose up

# or

docker-compose up -d # To run in detached mode
```
