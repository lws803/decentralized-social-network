const socketServer = require("http").createServer();
const io = require("socket.io")(socketServer);
io.on("connection", client => {
  client.on("event", data => {
    console.log(data);
  });
  client.on("disconnect", () => {
    console.log("disconnected");
  });
});
socketServer.listen(3000);
