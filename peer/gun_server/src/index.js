var Gun = require("gun");

var config = {
  port: 8765,
};

config.server = require("http").createServer(Gun.serve(__dirname));

Gun({ web: config.server.listen(config.port) });
