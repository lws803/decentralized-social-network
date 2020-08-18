import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import "gun/sea";
import "semantic-ui-css/semantic.min.css";
import "./common/css/content-styles.css";
require("dotenv").config();

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

async function InitiateGunPeers() {
  if (
    !sessionStorage.getItem("currentPeers") ||
    !sessionStorage.getItem("currentAPI")
  ) {
    var storedPeers = [process.env.REACT_APP_INIT_PEER, "127.0.0.1"];
    if (localStorage.getItem["peers"])
      storedPeers.concat(localStorage.getItem["peers"].peers);
    storedPeers = await extractValid(pullFromBucket(storedPeers));
    var newPeers = [];
    // If less than 10 peers in storage we will refresh and rediscover
    if (storedPeers.length < 10)
      for (var i = 0; i < storedPeers.length; i++) {
        try {
          const res = await axios.get(`http://${storedPeers[i]}:5000/peers`);
          if (res && res.data.peers) newPeers.concat(res.data.peers);
        } catch (err) {}
      }
    localStorage.setItem(
      "peers",
      JSON.stringify({ peers: [...storedPeers, ...newPeers] })
    );
    var bucketPeers = Array.from(
      new Set([
        ...storedPeers,
        ...(await extractValid(pullFromBucket(newPeers))),
        process.env.REACT_APP_INIT_PEER,
      ])
    );
    const selectedPeer =
      bucketPeers[Math.floor(Math.random() * bucketPeers.length)];

    function peerToGunURL(peer) {
      return `http://${peer}:8765/gun`;
    }

    sessionStorage.setItem(
      "currentPeers",
      JSON.stringify({
        items: bucketPeers.map(peerToGunURL),
      })
    );
    sessionStorage.setItem("currentPeer", `http://${selectedPeer}:8765/gun`);
    sessionStorage.setItem("currentAPI", `http://${selectedPeer}:5000`);
  }
}

InitiateGunPeers().then(() => {
  ReactDOM.render(<App />, document.getElementById("root"));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
});
