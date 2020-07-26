const grpc = require("grpc");
const mysql = require("mysql");
const Blockchain = require("../common/block");
const Encryption = require("../common/encryption");
const packageDefinition = require("../protos/packageDefinition");

var dbSession = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

var transactionProto = grpc.loadPackageDefinition(packageDefinition)
  .transaction;

function getPrevHash(dbSession, callback) {
  Blockchain.obtainLatestBlock(dbSession, (error, result) => {
    if (error) return callback(undefined);
    if (!result) return undefined;
    return callback(result.hash);
  });
}

function startTransaction(callback) {
  dbSession.query("START TRANSACTION", callback);
}

function testAndExecute(dbSession, statement, callback) {
  // TODO: Add better checks here
  startTransaction((error, results) => {
    if (error) return callback(error, results);
    dbSession.query(statement, (error, results) => {
      if (error) return callback(error, results);
      dbSession.query("COMMIT", (error, results) => {
        return callback(error, results);
      });
    });
  });
}

function sendBlock(call, callback) {
  getPrevHash(dbSession, prevHash => {
    if (call.request.precedingHash === prevHash) {
      try {
        let sqlStatement = Encryption.decrypt(
          JSON.parse(call.request.encryptedPayload)["data"]
        );
        console.log(sqlStatement);
        testAndExecute(dbSession, sqlStatement, (error, results) => {
          if (error) return callback(null, { acknowledgement: false });
          return callback(null, { acknowledgement: true });
        });
      } catch (error) {
        // Cannot decrypt
        return callback(null, { acknowledgement: false });
      }
    }
  });
}

var server = new grpc.Server();
server.addService(transactionProto.Transaction.service, {
  sendBlock: sendBlock,
});
server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
server.start();

console.log("server started, listening for RPC calls")
// TODO: Server will take on the role of updating and receiving updates
// It is the role of the more updated node to send the updates to the out of date nodes
// Receiver will have to resolve by rolling back a few steps to the starting hash of the payloads
// Only way to do so is to start the db from a blank state and replay from the start
