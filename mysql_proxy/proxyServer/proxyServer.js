const net = require("net");
const mysql = require("mysql");
const Blockchain = require("../common/block");
const Encryption = require("../common/encryption");
const ConsensusClient = require("./helpers/consensus");

var dbSession = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

process.on("uncaughtException", function (error) {
  console.error(error);
});

var localport = process.env.DB_PORT_FORWARDED;
var remotehost = process.env.DB_HOST;
var remoteport = process.env.DB_PORT;

console.log("connected as id " + dbSession.threadId);
dbSession.query("SELECT COUNT(*) from blockchain", (error, results) => {
  if (error) throw error;
  if (!results[0]["COUNT(*)"]) {
    Blockchain.startGenesisBlock(dbSession, () => {});
  }
});

Blockchain.checkChainValidity(dbSession, ({ isValid }) => {
  console.log(isValid);
});

var server = net.createServer(function (localsocket) {
  var remotesocket = new net.Socket();

  remotesocket.connect(remoteport, remotehost);

  localsocket.on("connect", function (data) {
    console.log(
      ">>> connection #%d from %s:%d",
      server.connections,
      localsocket.remoteAddress,
      localsocket.remotePort
    );
  });

  localsocket.on("data", function (data) {
    const writeData = data => {
      var flushed = remotesocket.write(data);
      if (!flushed) {
        console.log("  remote not flushed; pausing local");
        localsocket.pause();
      }
    };
    var command = data.toString("utf8").substr(5);
    if (
      command.startsWith("INSERT INTO") ||
      command.startsWith("DELETE FROM") ||
      command.startsWith("UPDATE ") ||
      command.startsWith("insert into") ||
      command.startsWith("delete from") ||
      command.startsWith("update ")
    ) {
      let encryptedPayload = JSON.stringify({
        data: Encryption.encrypt(command),
      });
      ConsensusClient.sendTransactionToAll(
        encryptedPayload,
        dbSession,
        accepted => {
          if (accepted) {
            Blockchain.addNewBlock(encryptedPayload, dbSession, () => {
              writeData(data);
            });
          }
          // FIXME: Return an error if not so application will not get stuck
        }
      );
      // TODO: Bypass consensus
      // Blockchain.addNewBlock(encryptedPayload, dbSession, () => {
      //   writeData(data);
      // });
    } else {
      writeData(data);
    }
  });

  remotesocket.on("data", function (data) {
    var flushed = localsocket.write(data);
    if (!flushed) {
      console.log("  local not flushed; pausing remote");
      remotesocket.pause();
    }
  });

  localsocket.on("drain", function () {
    console.log(
      "%s:%d - resuming remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    remotesocket.resume();
  });

  remotesocket.on("drain", function () {
    console.log(
      "%s:%d - resuming local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    localsocket.resume();
  });

  localsocket.on("close", function (had_error) {
    console.log(
      "%s:%d - closing remote",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    remotesocket.end();
  });

  remotesocket.on("close", function (had_error) {
    console.log(
      "%s:%d - closing local",
      localsocket.remoteAddress,
      localsocket.remotePort
    );
    localsocket.end();
  });
});

server.listen(localport, process.env.HOST);

console.log(
  "redirecting connections from %s:%d to %s:%d",
  process.env.HOST,
  localport,
  remotehost,
  remoteport
);
