const IpfsHttpClient = require("ipfs-http-client");
const redis = require("redis");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
require("dotenv").config();

const client = redis.createClient(process.env.REDIS_URI);
const ipfs = IpfsHttpClient(process.env.IPFS_URL);
var app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

async function uploadFileIPFS(file) {
  console.log("uploading...");
  const uploadedFile = await ipfs.add(file);
  return uploadedFile;
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

app.post("/image_upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let file = req.files.upload;
      uploadFileIPFS(file.data)
        .then(uploadedFile => {
          const url = `http://ipfs.io/ipfs/${uploadedFile.path}`;
          console.log(url);
          res.send({
            url: url,
          });
        })
        .catch(err => {
          res.status(500).send({ message: err });
        });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.get("/peers", async (req, res) => {
  try {
    getPeers()
      .then(peersJSON => {
        if (peersJSON) {
          var peers = JSON.parse(peersJSON).items;
          if (peers.length > 3) peers = getRandom(peers, 3);
          res.send({
            peers: peers,
          });
        }
      })
      .catch(err => res.status(500).send({ message: err }));
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}...`);
});
