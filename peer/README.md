# Peer Node

## Deploy docker container

1. Edit the `docker-compose.yml` file and set `INIT_PEER`, `MY_ADDRESS` env variables

2. Run docker compose
    ```bash
    # From peer directory
    docker-compose up -d
    ```

### RPi setup

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

### Build for all platforms
1. Enable buildx support https://www.docker.com/blog/multi-arch-images/
2. Build for multiple platforms
    ```bash
    docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 .
    ```
