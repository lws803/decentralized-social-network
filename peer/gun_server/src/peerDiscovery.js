const redis = require("redis");
const axios = require("axios");
const publicIp = require("public-ip");
require("dotenv").config();

const client = redis.createClient(process.env.REDIS_URI, { db: 1 });

function getAllKeys() {
  return new Promise((resolve, reject) =>
    client.keys("*", (err, res) => {
      if (err) reject(err);
      else resolve(res);
    })
  );
}

function delKey(key) {
  return new Promise((resolve, reject) =>
    client.del(key, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    })
  );
}

function addNewKey(key) {
  return new Promise((resolve, reject) => {
    client.set(key, "active", (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

async function extractValid(peers) {
  var peerSet = new Set(peers);
  var validPeers = [];
  for (let peer of peerSet) {
    try {
      if (await axios.get(`http://${peer}:5000/healthcheck`)) {
        validPeers.push(peer);
        addNewKey(peer);
      }
    } catch (err) {
      await delKey(peer);
    }
  }
  return validPeers;
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

function pullFromBucket(arr) {
  if (!arr.length) return arr;
  if (arr.length >= 10) {
    return getRandom(arr, 3);
  } else {
    return getRandom(arr, Math.floor(arr.length / 2 + 1));
  }
}

async function findSuitablePeers(peers, retries) {
  for (var retry = 0; retry < retries; retry++) {
    if (!peers) return [];
    var bucket = pullFromBucket(peers);
    peers = await extractValid(bucket);
    if (peers.length) {
      return peers;
    }
  }
  return [];
}

async function findPeersOfPeers(validParents) {
  var newPeers = [];
  for (var i = 0; i < validParents.length; i++) {
    try {
      let res = await axios.get(`http://${validParents[i]}:5000/peers`);
      if (res && res.data.peers) {
        newPeers = [...newPeers, ...res.data.peers];
      }
    } catch (err) {
      await delKey(validParents[i]);
    }
  }
  return newPeers;
}

async function peerDiscovery() {
  var peersList = [];
  const retries = 20;
  const myAddr = process.env.MY_ADDRESS
    ? process.env.MY_ADDRESS
    : await publicIp.v4();
  const initialPeers = [process.env.INIT_PEER, myAddr, "127.0.0.1"];
  for (var retry = 0; retry < retries; retry++) {
    var peers = await getAllKeys();
    peers = [...peers, ...initialPeers];
    var validParents = await findSuitablePeers(peers, 10);
    // Decide if we should update the peers list
    if (peers && peers.length < 20) {
      var newPeers = await findPeersOfPeers(validParents);
      newPeers = await findSuitablePeers(newPeers, 10);
      validParents = [...validParents, ...newPeers];
    }
    if (validParents.length) {
      peersList = [...validParents];
      break;
    }
  }
  const dedupedPeersList = Array.from(new Set(peersList));
  // Dedupe and pull from bucket
  return pullFromBucket(dedupedPeersList);
}

module.exports = peerDiscovery;
