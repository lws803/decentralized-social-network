# Client

## Setup
Run `npm install` from this folder before proceeding

### Storybook

```bash
npm run storybook
```

## Run locally
Please follow readme in `peer` directory before running the following

```bash
npm run start
```

## Deploy docker container

1. Setup env variables in `docker-compose.yml` for `REACT_INIT_PEER`
2. Run docker compose
    ```bash
    # From client directory
    docker-compose up -d
    ```

### Build for all platforms
1. Enable buildx support https://www.docker.com/blog/multi-arch-images/
2. Build for multiple platforms
    ```bash
    docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 .
    ```
