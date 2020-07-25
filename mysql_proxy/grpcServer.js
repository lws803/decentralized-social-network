var PROTO_PATH = __dirname + "/protos/transaction.proto";

var grpc = require("grpc");
const mysql = require("mysql");
const Blockchain = require("./common/block");
const Encryption = require("./common/encryption");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

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
  Blockchain.obtainLatestBlock(dbSession, result => {
    callback(result.hash);
  });
}

function startTransaction(callback) {
  dbSession.query("START TRANSACTION", callback);
}

function testAndExecute(dbSession, statement, callback) {
  // TODO: Add better checks here
  startTransaction((error, results) => {
    if (error) callback(error, results);
    dbSession.query(statement, (error, results) => {
      if (error) callback(error, results);
      dbSession.query("COMMIT", (error, results) => {
        callback(error, results);
      });
    });
  });
}

function sendBlock(call, callback) {
  getPrevHash(dbSession, prevHash => {
    if (call.request.precedingHash === prevHash) {
      let sqlStatement = Encryption.decrypt(
        JSON.parse(call.request.encryptedPayload)["data"]
      );
      console.log(sqlStatement);
      callback(null, { acknowledgement: true });
      // callback(null, { acknowledgement: true });
      // testAndExecute(
      //   dbSession,
      //   sqlStatement,
      //   (error, results) => {
      //     if (error) callback(null, { acknowledgement: false });
      //     callback(null, { acknowledgement: true });
      //   }
      // );
    }
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(transactionProto.Transaction.service, {
    sendBlock: sendBlock,
  });
  server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
