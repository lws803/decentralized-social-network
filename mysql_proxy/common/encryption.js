var crypto = require("crypto"),
  algorithm = "aes-256-cbc",
  password = process.env.AES_SQL_KEY,
  nonce = process.env.AES_SQL_NONCE;

class Encryption {

  static encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, password, nonce);
    var crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  }

  static decrypt(text) {
    var decipher = crypto.createDecipheriv(algorithm, password, nonce);
    var dec = decipher.update(text, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  }
}

module.exports = Encryption
