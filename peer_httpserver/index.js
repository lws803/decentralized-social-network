const IpfsHttpClient = require("ipfs-http-client");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");

const { globSource } = IpfsHttpClient;
const ipfs = IpfsHttpClient();
var app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

async function uploadFileIPFS() {
  const file = await ipfs.add(globSource("./cat_7.png", { recursive: true }));
  console.log(file);
}

// uploadFile().then();

app.post("/image_upload", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      // let avatar = req.files.avatar;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      // avatar.mv("./uploads/" + avatar.name);
      console.log(req.files.upload)
      // TODO: FInd out how to extract the blob and upload it to IPFS

      //send response
      res.send({
        status: true,
        message: "File is uploaded",
      });
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("Server started...");
});
