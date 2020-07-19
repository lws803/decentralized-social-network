# Decentralized Social Network backend

## Setup

### Create database

```
mysql> CREATE DATABASE social_network CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
```


```
mysql> CREATE USER 'bob'@'localhost'
    -> IDENTIFIED BY 'banana';
```

Grant the user access privileges

```
mysql> GRANT ALL ON social_network.* TO 'bob'@'localhost';
```


### Setup environment

```bash
export MYSQL_PROD=...
export API_KEY=...
```
