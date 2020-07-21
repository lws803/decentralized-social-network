# Node MySQL proxy server

## Usage

Start the proxy server
```bash
node ProxyServer.js 3307 127.0.0.1 3306
```

Test by accessing the db as such
```bash
sudo mysql -h 127.0.0.1 -P 3307
```
