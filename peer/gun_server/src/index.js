var Gun = require("gun");
const redis = require("redis");

const client = redis.createClient(process.env.REDIS_URI);

function spawnPeers() {
  return new Promise((resolve, reject) => {
    const initList = ["init_test_url"];
    client.set("peers", JSON.stringify({ items: initList }), (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function getPeers() {
  return new Promise((resolve, reject) => {
    client.get("peers", (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

async function start() {
  var config = {
    port: 8765,
  };
  config.server = require("http").createServer(Gun.serve(__dirname));
  await spawnPeers();
  var peersJSON = await getPeers();
  var peers = [];
  if (!peersJSON) {
    await spawnPeers();
    peersJson = await getPeers();
    peers = JSON.parse(peersJson).items;
  } else {
    peers = JSON.parse(peersJSON).items;
  }
  console.log("initiating peers list:", peers);

  Gun({ web: config.server.listen(config.port), peers: peers });
}

start();
