const IpfsHttpClient = require("ipfs-http-client");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
require("dotenv").config();

const ipfs = IpfsHttpClient(process.env.IPFS_URL)
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

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}...`);
});
