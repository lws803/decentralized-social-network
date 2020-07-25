var PROTO_PATH = __dirname + "/transaction.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var transactionProto = grpc.loadPackageDefinition(packageDefinition)
  .transaction;

class ConsensusClient {
  static findTrackers(dbSession, callback) {
    dbSession.query("SELECT * from trackers", (error, results) => {
      if (error) callback(undefined);
      else callback(results);
    });
  }

  static findLatestHash(dbSession, callback) {
    let query = "SELECT * FROM blockchain ORDER BY id DESC LIMIT 1";
    dbSession.query(query, (error, results) => {
      if (error) callback(undefined);
      else if (!results) callback(undefined);
      else callback(results[0].hash);
    });
  }

  static sendTransaction(latestHash, payload, url, callback) {
    var client = new transactionProto.Transaction(
      `${url}:50051`,
      grpc.credentials.createInsecure() // TODO: Create secure ssl in future
    );
    client.sendBlock(
      {
        precedingHash: latestHash,
        encryptedPayload: payload,
      },
      (err, response) => {
        if (err) return callback(false);
        if (!response) return callback(false);
        return callback(response.acknowledgement);
      }
    );
  }

  static sendTransactionToAll(payload, dbSession, callback) {
    var acceptedCount = 1;
    this.findLatestHash(dbSession, latestHash => {
      this.findTrackers(dbSession, trackers => {
        for (let i = 0; i < trackers.length; i++) {
          let url = trackers[i].url;
          // TODO: Consider the active status of the tracker in future
          this.sendTransaction(latestHash, payload, url, acknowledgement => {
            if (acknowledgement) acceptedCount += 1;
            if (i === trackers.length - 1) {
              // At least 51% consent
              if (acceptedCount / (trackers.length + 1) > 0.51) {
                return callback(true);
              } else {
                return callback(false);
              }
            }
          });
        }
      });
    });
  }
}

module.exports = ConsensusClient;
