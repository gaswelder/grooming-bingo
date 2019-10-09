const http = require("http");
const ws = require("ws");
const fs = require("fs");
const util = require("util");
const socketsInterface = require("./server/sockets-interface");

const p = util.promisify;
const readFile = p(fs.readFile);

function serveFile(res, localPath) {
  readFile(__dirname + "/" + localPath)
    .then(src => res.write(src))
    .catch(err => res.write(err.toString()))
    .then(() => res.end());
}

const staticFiles = {
  "/": "index.html",
  "/grooming.js": "grooming.bin.js",
  "/style.css": "style.css"
};

const server = http.createServer(function(req, res) {
  if (req.url in staticFiles) {
    serveFile(res, staticFiles[req.url]);
    return;
  }
  res.write("Nothing");
  res.end();
});
const wss = new ws.Server({ server });
socketsInterface(wss);

server.listen(process.env.PORT || 8080);
