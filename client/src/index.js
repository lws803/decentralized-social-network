import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import axios from "axios";
import "gun/sea";
import "semantic-ui-css/semantic.min.css";

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
  var storedPeers = ["127.0.0.1"]; // TODO: Change this to a default
  if (localStorage.getItem["peers"])
    storedPeers.concat(localStorage.getItem["peers"].peers);
  storedPeers = await extractValid(storedPeers);
  var newPeers = [...storedPeers];
  // If less than 10 peers in storage we will refresh and rediscover
  if (storedPeers.length < 10)
    for (var i = 0; i < storedPeers.length; i++) {
      try {
        const res = await axios.get(`http://${storedPeers[i]}:5000/peers`);
        if (res && res.data.peers) newPeers.concat(res.data.peers);
      } catch (err) {}
    }
  storedPeers.concat(await extractValid(newPeers));

  const selectedPeer =
    storedPeers[Math.floor(Math.random() * storedPeers.length)];
  localStorage.setItem("peers", JSON.stringify({ peers: storedPeers }));
  sessionStorage.setItem("currentPeer", `http://${selectedPeer}:8765/gun`);
  sessionStorage.setItem("currentAPI", `http://${selectedPeer}:5000`);
}

InitiateGunPeers().then(() => {
  ReactDOM.render(
    <App />,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
});
