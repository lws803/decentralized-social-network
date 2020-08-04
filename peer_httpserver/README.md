# Peer HTTP server

## Setup 

### Setup IPFS Daemon

1. Install IPFS from https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
2. Setup IPFS in server mode
    ```bash
    ipfs init --profile server
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
    ```
3. Launch IPFS
    ```bash
    ipfs daemon
    ```

### Start node server
```bash
node index.js
```
