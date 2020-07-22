const net = require("net");
const io = require("socket.io-client");
const SHA256 = require('crypto-js/sha256');

process.on("uncaughtException", function (error) {
  console.error(error);
});

if (process.argv.length != 5) {
  console.log(
    "usage: %s <localport> <remotehost> <remoteport>",
    process.argv[1]
  );
  process.exit();
}

var localport = process.argv[2];
var remotehost = process.argv[3];
var remoteport = process.argv[4];

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
    var command = data.toString("utf8").substr(1);
    if (command.includes("INSERT INTO") || command.includes("DELETE FROM")) {
      console.log(command);
    }
    var flushed = remotesocket.write(data);
    if (!flushed) {
      console.log("  remote not flushed; pausing local");
      localsocket.pause();
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

server.listen(localport);

console.log(
  "redirecting connections from 127.0.0.1:%d to %s:%d",
  localport,
  remotehost,
  remoteport
);
