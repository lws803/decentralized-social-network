const Blockchain = require("../common/block");
const mysql = require("mysql");

var dbSession = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

Blockchain.checkChainValidity(
  dbSession,
  (error, { isValid, currentBlock, precedingBlock }) => {
    if (error) {
      console.log(error);
    }
    if (!isValid) {
      console.log(currentBlock, precedingBlock);
    }
    console.log(isValid);
  }
);
