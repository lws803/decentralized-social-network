var Gun = require("gun");
const redis = require("redis");
const axios = require("axios");
const publicIp = require("public-ip");

const client = redis.createClient(process.env.REDIS_URI);

function addPeersToRedis(peerList) {
  return new Promise((resolve, reject) => {
    client.set("peers", JSON.stringify({ items: peerList }), (err, res) => {
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

async function extractValid(peers) {
  var peerSet = new Set(peers);
  var validPeers = [];
  for (let peer of peerSet) {
    try {
      if (await axios.get(`http://${peer}:5000/healthcheck`))
        validPeers.push(peer);
    } catch (err) {}
  }
  return validPeers;
}

async function requestNewPeersfromExstingPeers(peers) {
  var validParents = await extractValid(peers);
  var checkedPeers = [...validParents];
  var newPeers = [];
  for (var i = 0; i < validParents.length; i++) {
    try {
      let res = await axios.get(`http://${validParents[i]}:5000/peers`);
      if (res && res.data.peers) {
        newPeers.concat(res.data.peers);
      }
    } catch (err) {}
  }
  checkedPeers.concat(await extractValid(newPeers));

  let currentIP = await publicIp.v4();
  var arrayOfPeers = Array.from(checkedPeers);
  arrayOfPeers.push(currentIP);
  await addPeersToRedis(arrayOfPeers);
  return arrayOfPeers;
}

async function start() {
  var config = {
    port: 8765,
  };
  config.server = require("http").createServer(Gun.serve(__dirname));
  var parentPeersJSON = await getPeers();
  var peers = [];
  if (!parentPeersJSON) {
    peers.push("init_peer");
  } else {
    peers = JSON.parse(parentPeersJSON).items;
  }
  var sanitizedPeers = await requestNewPeersfromExstingPeers(peers);
  if (sanitizedPeers.length > 3) sanitizedPeers = getRandom(sanitizedPeers, 3);
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
