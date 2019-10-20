const http = require("http");
const ws = require("ws");
const fs = require("fs");
const util = require("util");
const socketsInterface = require("./sockets-interface");
const { Grooming } = require("./grooming");

const readFile = util.promisify(fs.readFile);

module.exports = function main() {
  const staticFiles = {
    "/": "../index.html",
    "/grooming.js": "../grooming.bin.js",
    "/style.css": "../style.css"
  };

  const specialMessages = (process.env.SPECIAL_MESSAGES || "here")
    .trim()
    .split(/\s+/)
    .map(s => "@" + s);

  /**
   * A Grooming instance for the current session.
   */
  const grooming = new Grooming({
    specialMessages
  });

  const server = http.createServer(function(req, res) {
    if (req.url in staticFiles) {
      serveFile(res, staticFiles[req.url]);
      return;
    }
    res.write("Nothing");
    res.end();
  });

  const wss = new ws.Server({ server });
  socketsInterface(wss, grooming);

  server.listen(process.env.PORT || 8080);
};

function serveFile(res, localPath) {
  readFile(__dirname + "/" + localPath)
    .then(src => res.write(src))
    .catch(err => res.write(err.toString()))
    .then(() => res.end());
}
