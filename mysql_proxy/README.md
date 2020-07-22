# Node MySQL proxy server

## Usage

> Make sure that the database has been migrated beforehand

Start the proxy server
```bash
node src/proxyServer.js
```
<!-- TODO: Talk about the env file as well -->


## Setup

Turn SSL off for MySQL

### Environment variables using a .env file

```
HOST=0.0.0.0
DB_HOST=db (or use localhost)
DB_USER=bob
DB_PASS=banana
DB_NAME=social_network
DB_PORT=3306
DB_PORT_FORWARDED=3307
SECRET_KEY=...
AES_SQL_KEY=...
AES_SQL_NONCE=...
```
