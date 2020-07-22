require("dotenv").config();
const SHA256 = require("crypto-js/sha256");
var crypto = require("crypto"),
  algorithm = "aes-256-cbc",
  password = process.env.AES_SQL_KEY,
  nonce = process.env.AES_SQL_NONCE;

function encrypt(text) {
  var cipher = crypto.createCipheriv(algorithm, password, nonce);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipheriv(algorithm, password, nonce);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

function computeHash(precedingHash, stringData) {
  return SHA256(precedingHash + stringData).toString();
}

class Blockchain {
  static startGenesisBlock(dbSession, callback) {
    let precedingHash = "genesis";
    let data = { data: "SELECT 1" };
    let encryptedData = { data: encrypt("SELECT 1") };
    let hash = computeHash(precedingHash, JSON.stringify(data));
    let query =
      `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
      `values ('${hash}', '${precedingHash}', '${JSON.stringify(
        encryptedData
      )}')`;

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

  static addNewBlock(command, dbSession, callback) {
    let encryptedData = JSON.stringify({ data: encrypt(command) });
    let packagedData = JSON.stringify({ data: command });

    this.obtainLatestBlock(dbSession, result => {
      let precedingHash = result.hash;
      let hash = computeHash(precedingHash, packagedData);
      let query =
        `INSERT INTO blockchain (hash, preceding_hash, sql_statement) ` +
        `values ('${hash}', '${precedingHash}', '${encryptedData}')`;

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
          let currentEncryptedStatement = JSON.parse(
            currentBlock.sql_statement
          )["data"];
          let decryptedDataString = JSON.stringify({
            data: decrypt(currentEncryptedStatement),
          });

          if (
            currentBlock.hash !==
            computeHash(precedingBlock.hash, decryptedDataString)
          ) {
            return callback({
              isValid: false,
              currentBlock: currentBlock,
              precedingBlock: precedingBlock,
            });
          }
          if (currentBlock.preceding_hash !== precedingBlock.hash) {
            return callback({
              isValid: false,
              currentBlock: currentBlock,
              precedingBlock: precedingBlock,
            });
          }
        }
      }
      return callback({
        isValid: true,
        currentBlock: undefined,
        precedingBlock: undefined,
      });
    });
  }
}

module.exports = Blockchain;
