var Gun = require("gun");

const peerDiscovery = require("./peerDiscovery");

async function start() {
  var config = {
    port: 8765,
  };
  config.server = require("http").createServer(Gun.serve(__dirname));
  const sanitizedPeers = await peerDiscovery();
  function peerToURL(peer) {
    return `http://${peer}:8765/gun`;
  }
  console.log(sanitizedPeers.map(peerToURL));
  Gun({
    web: config.server.listen(config.port),
    peers: sanitizedPeers.map(peerToURL),
  });
}
start();
