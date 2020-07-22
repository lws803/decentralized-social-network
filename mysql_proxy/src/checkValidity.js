const Blockchain = require("./common/block");
const mysql = require("mysql");

var dbSession = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

dbSession.connect(err => {
  Blockchain.checkChainValidity(
    dbSession,
    ({ isValid, currentBlock, precedingBlock }) => {
      console.log(isValid);
      if (!isValid) {
        console.log(currentBlock, precedingBlock);
      }
    }
  );
});
