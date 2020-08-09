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

function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
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
  if (peers.length > 3)
    peers = getRandom(peers, 3)

  console.log("initiating peers list:", peers);
  // TODO: Requests for a list of peers to populate the list from other peers

  Gun({ web: config.server.listen(config.port), peers: peers });
}

start();
