var PROTO_PATH = __dirname + "/src/protos/transaction.proto";

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

function main() {
  var client = new transactionProto.Transaction(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  client.sendBlock(
    {
      precedingHash:
        "e08553aa88dbe892d892bedc48517e8ef5caa16fc314469d6c21fc2f6cfc0bfe",
      sqlStatement: "SELECT 1",
    },
    (err, response) => {
      console.log(response.acknowledgement);
    }
  );
}

main();
