const Blockchain = require("../common/block");
const Encryption = require("../common/encryption");
const mysql = require("mysql");

var dbSession = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

dbSession.connect(err => {
  let query = "SELECT * FROM blockchain ORDER BY id";
  dbSession.query(query, (error, results) => {
    if (error) throw error;
    if (results.length > 1) {
      for (var i = 1; i < results.length; i++) {
        let currentBlock = results[i];
        let precedingBlock = results[i - 1];
        let currentEncryptedStatement = JSON.parse(currentBlock.sql_statement)[
          "data"
        ];
        if (
          currentBlock.hash !==
          Blockchain.computeHash(
            precedingBlock.hash,
            JSON.stringify(JSON.parse(currentBlock.sql_statement))
          )
        ) {
          return;
        }
        if (currentBlock.preceding_hash !== precedingBlock.hash) {
          return;
        }
        let decryptedStatement = Encryption.decrypt(currentEncryptedStatement);
        console.log(decryptedStatement);
        dbSession.query(
          decryptedStatement,
          (error, results) => {
            console.log(results);
          }
        );
      }
    }
    return;
  });
});
