require("dotenv").config();
const SHA256 = require("crypto-js/sha256");
const mysql = require("mysql");

function computeHash(precedingHash, stringData) {
  return SHA256(precedingHash + stringData).toString();
}

class Blockchain {
  static startGenesisBlock(dbSession, callback) {
    let precedingHash = "genesis";
    let data = { data: "SELECT 1" };
    let hash = computeHash(precedingHash, JSON.stringify(data));
    let query =
      `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
      `values ('${hash}', '${precedingHash}', '${JSON.stringify(data)}')`;

    dbSession.query(query, (error, results) => {
      if (error) throw error;
      return callback(results);
    });
  }

  static obtainLatestBlock(dbSession, callback) {
    let query = "SELECT * FROM blockchain ORDER BY id DESC LIMIT 1";
    dbSession.query(query, (error, results) => {
      if (error) throw error;
      if (results) {
        return callback(results[0]);
      } else {
        return callback(undefined);
      }
    });
  }

  static addNewBlock(data, dbSession, callback) {
    this.obtainLatestBlock(dbSession, result => {
      let precedingHash = result.hash;
      let hash = computeHash(precedingHash, JSON.stringify(data));
      let query =
        `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
        `values ('${hash}', '${precedingHash}', '${JSON.stringify(data)}')`;

      dbSession.query(query, (error, results) => {
        if (error) throw error;
        return callback(results);
      });
    });
  }

  static checkChainValidity(dbSession, callback) {
    let query = "SELECT * FROM blockchain ORDER BY id";
    dbSession.query(query, (error, results) => {
      if (error) throw error;
      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          let currentBlock = results[i];
          let precedingBlock = results[i - 1];
          if (
            currentBlock.hash !==
            computeHash(
              precedingBlock.hash,
              JSON.stringify(JSON.parse(currentBlock.sql_statement))
            )
          ) {
            return callback(false);
          }
          if (currentBlock.preceding_hash !== precedingBlock.hash) {
            return callback(false);
          }
        }
      }
      return callback(true);
    });
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
  // Blockchain.startGenesisBlock(dbSession, () => {});
  // Blockchain.obtainLatestBlock(dbSession);
  // Blockchain.addNewBlock({ data: "SELECT 2" }, dbSession, () => {});
  Blockchain.checkChainValidity(dbSession, isValid => {
    console.log(isValid);
  });
});
