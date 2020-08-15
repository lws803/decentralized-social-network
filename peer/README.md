# Peer Node

## Setup

```bash
# From peer directory
docker-compose up -d
```

## Setup (RPi)

1. Build IPFS docker image from source
    ```bash
    git clone https://github.com/ipfs/go-ipfs
    cd go-ipfs && docker build -t ipfs/go-ipfs:latest .
    ```

2. Run docker compose
```bash
# From peer directory
docker-compose up -d
```
