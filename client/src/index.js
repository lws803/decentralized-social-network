import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

function InitiateGunPeers() {
  const initialPeers = ["http://127.0.0.1:8765/gun"]; // TODO: We can add more here
  if (!localStorage.getItem("peers")) {
    localStorage.setItem("peers", JSON.stringify({ items: initialPeers }));
  }
  // TODO: Add the logic to request for more peers here from axios
  const storedPeers = JSON.parse(localStorage.getItem("peers")).items;
  const selectedPeer = storedPeers[Math.floor(Math.random() * storedPeers.length)];
  sessionStorage.setItem("currentPeer", selectedPeer);
}

InitiateGunPeers();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
