const grpc = require("grpc");
const packageDefinition = require("../../protos/packageDefinition");
const Blockchain = require("../../common/block");
const externalip = require("externalip");

var transactionProto = grpc.loadPackageDefinition(packageDefinition)
  .transaction;

class ConsensusClient {
  static findTrackers(dbSession, callback) {
    dbSession.query("SELECT * from trackers", (error, results) => {
      if (error) return callback([]);
      else return callback(results);
    });
  }

  static findLatestHash(dbSession, callback) {
    let query = "SELECT * FROM blockchain ORDER BY id DESC LIMIT 1";
    dbSession.query(query, (error, results) => {
      if (error) return callback(undefined);
      else if (!results) return callback(undefined);
      else return callback(results[0].hash);
    });
  }

  static sendTransaction(latestHash, payload, url, callback) {
    var client = new transactionProto.Transaction(
      `${url}:50051`,
      grpc.credentials.createInsecure()
    );
    client.sendBlock(
      {
        precedingHash: latestHash,
        encryptedPayload: payload,
      },
      (err, response) => {
        console.warn(err);
        if (err) return callback(err, response);
        if (!response) return callback(err, response);
        return callback(err, response);
      }
    );
  }

  static propagateTransaction(latestHash, payload, url, callback) {
    var client = new transactionProto.Transaction(
      `${url}:50051`,
      grpc.credentials.createInsecure()
    );
    externalip(function (err, ip) {
      client.sendBlock(
        {
          precedingHash: latestHash,
          encryptedPayload: payload,
          visitedNodes: [{ url: ip }],
        },
        callback
      );
    });
  }

  static sendTransactionToAll(payload, dbSession, callback) {
    var acceptedCount = 1;
    this.findLatestHash(dbSession, latestHash => {
      this.findTrackers(dbSession, trackers => {
        var availableTrackers = trackers.length + 1;

        for (let i = 0; i < trackers.length; i++) {
          let url = trackers[i].url;
          // TODO: Consider the active status of the tracker in future
          this.sendTransaction(latestHash, payload, url, (err, results) => {
            if (err && err.code == 14) availableTrackers -= 1;
            if (!err && results.acknowledgement) acceptedCount += 1;
            if (i === trackers.length - 1) {
              console.log;
              if (acceptedCount / availableTrackers > 0.51) {
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

  static sendTransactionRandom(payload, dbSession, callback) {
    this.findLatestHash(dbSession, latestHash => {
      this.findTrackers(dbSession, trackers => {
        var foundCandidate = false;
        while (!foundCandidate) {
          selectedTracker = trackers[Math.floor(Math.random() * arr.length)];
          this.propagateTransaction(
            latestHash,
            payload,
            selectedTracker.url,
            (error, result) => {
              if (!error) foundCandidate = false;
            }
          );
        }
      });
    });
  }
}

module.exports = ConsensusClient;
