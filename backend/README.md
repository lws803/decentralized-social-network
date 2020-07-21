# Decentralized Social Network backend

## Setup

### Create database

```
mysql> CREATE DATABASE social_network CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
mysql> CREATE DATABASE social_network_test CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```


```
mysql> CREATE USER 'bob'@'localhost'
    -> IDENTIFIED BY 'banana';
```

Grant the user access privileges

```
mysql> GRANT ALL ON social_network.* TO 'bob'@'localhost';
mysql> GRANT ALL ON social_network_test.* TO 'bob'@'localhost';
```

### Setup environment

```bash
# In the backend folder
export PYTHONPATH=$PYTHONPATH:$(pwd)
export MYSQL_PROD=...
export MYSQL_TEST=...
export API_KEY=...
export SECRET_KEY=...
```

### Run alembic

```bash
# In the backend folder
alembic upgrade head
```

## Testing

```bash
# From backend folder
pytest -vv
```

### Build image
```bash
# From backend folder
docker build -t backend:latest ./
```

### Run image
```bash
docker run -d -p 80:80 backend:latest
```
