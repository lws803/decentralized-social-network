var mysql = require("mysql");
const socketServer = require("http").createServer();

const io = require("socket.io")(socketServer);
io.on("connection", client => {
  // var con = mysql.createConnection({
  //   host: "localhost",
  //   user: "yourusername",
  //   password: "yourpassword",
  //   database: "mydb",
  // });

  // con.connect(function (err) {
  //   if (err) throw err;
  //   con.query("SELECT * FROM customers", function (err, result, fields) {
  //     if (err) throw err;
  //     console.log(result);
  //   });
  // });

  client.on("event", data => {
    console.log(data);
  });
  client.on("disconnect", () => {
    console.log("disconnected");
  });
});
socketServer.listen(3000);
