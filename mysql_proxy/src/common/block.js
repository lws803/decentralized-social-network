require("dotenv").config();
const SHA256 = require("crypto-js/sha256");
const mysql = require("mysql");

function computeHash(precedingHash, data) {
  return SHA256(precedingHash + JSON.stringify(data)).toString();
}

class Blockchain {
  static startGenesisBlock(dbSession) {
    let data = { data: "SELECT 1" };
    let hash = computeHash("0", data);
    let query =
      `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
      `values ('${hash}', '${"0"}', '${JSON.stringify(data)}')`;

    dbSession.query(query, (error, results, fields) => {
      if (error) throw error;
      console.log(results);
    });
  }

  static obtainLatestBlock(dbSession) {
    // TODO: Use sql queries to get the latest block
    dbSession.query(query, (error, results, fields) => {
      if (error) throw error;
      console.log(results);
    });
    return;
  }
  static addNewBlock(newBlock, dbSession) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    // TODO: Use sql query to push this new block to mysql
    this.blockchain.push(newBlock);
  }

  static checkChainValidity(dbSession) {
    // TODO: Iterate through mysql to check the chain validity
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

// FIXME: Move this away to the main script when done testing
var dbSession = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

dbSession.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + dbSession.threadId);
  Blockchain.startGenesisBlock(dbSession);
});
