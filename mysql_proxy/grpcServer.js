var PROTO_PATH = __dirname + "/src/protos/transaction.proto";

var grpc = require("grpc");
const mysql = require("mysql");
const Blockchain = require("./src/common/block");
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
  dbSession.connect(err => {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
    getPrevHash(dbSession, prevHash => {
      if (call.request.precedingHash === prevHash) {
        testAndExecute(
          dbSession,
          call.request.sqlStatement,  // TODO: Decrypt this first
          (error, results) => {
            if (error) callback(null, { acknowledgement: false });
            callback(null, { acknowledgement: true });
          }
        );
      }
    });
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
