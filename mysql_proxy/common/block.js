require("dotenv").config();
const Encryption = require("./encryption");
const SHA256 = require("crypto-js/sha256");

class Blockchain {
  static computeHash(precedingHash, stringData) {
    return SHA256(precedingHash + stringData).toString();
  }

  static startGenesisBlock(dbSession, callback) {
    let precedingHash = "genesis";
    let encryptedData = { data: Encryption.encrypt("SELECT 1") };
    let hash = this.computeHash(precedingHash, JSON.stringify(encryptedData));
    let query =
      `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
      `values ('${hash}', '${precedingHash}', '${JSON.stringify(
        encryptedData
      )}')`;

    dbSession.query(query, callback);
  }

  static obtainLatestBlock(dbSession, callback) {
    let query = "SELECT * FROM blockchain ORDER BY id DESC LIMIT 1";
    dbSession.query(query, (error, results) => {
      if (error) return callback(error, undefined);
      if (results) {
        return callback(error, results[0]);
      } else {
        return callback(error, undefined);
      }
    });
  }

  static addNewBlock(encryptedPayload, dbSession, callback) {
    this.obtainLatestBlock(dbSession, (error, result) => {
      let precedingHash = result.hash;
      let hash = this.computeHash(precedingHash, encryptedPayload);
      let query =
        `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
        `values ('${hash}', '${precedingHash}', '${encryptedPayload}')`;

      dbSession.query(query, (error, results) => {
        return callback(error, results);
      });
    });
  }

  static checkChainValidity(dbSession, callback) {
    let query = "SELECT * FROM blockchain ORDER BY id";
    dbSession.query(query, (error, results) => {
      if (error) callback(error, undefined);
      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          let currentBlock = results[i];
          let precedingBlock = results[i - 1];
          if (
            currentBlock.hash !==
            this.computeHash(
              precedingBlock.hash,
              JSON.stringify(JSON.parse(currentBlock.sql_statement))
            )
          ) {
            return callback(error, {
              isValid: false,
              currentBlock: currentBlock,
              precedingBlock: precedingBlock,
            });
          }
          if (currentBlock.preceding_hash !== precedingBlock.hash) {
            return callback(error, {
              isValid: false,
              currentBlock: currentBlock,
              precedingBlock: precedingBlock,
            });
          }
        }
      }
      return callback(error, {
        isValid: true,
        currentBlock: undefined,
        precedingBlock: undefined,
      });
    });
  }
}

module.exports = Blockchain;
