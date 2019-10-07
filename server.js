const http = require("http");
const ws = require("ws");
const fs = require("fs");
const util = require("util");
const socketsInterface = require("./server/sockets-interface");

const p = util.promisify;
const readFile = p(fs.readFile);

const indexPage = fs.readFileSync(__dirname + "/index.html");
const groomingScript = () => readFile(__dirname + "/grooming.bin.js");

const server = http.createServer(function(req, res) {
  if (req.url == "/") {
    res.write(indexPage);
    res.end();
    return;
  }
  if (req.url == "/grooming.js") {
    groomingScript()
      .then(src => res.write(src))
      .catch(err => res.write(err.toString()))
      .then(() => res.end());
    return;
  }
  res.write("nothing is here");
  res.end();
});
const wss = new ws.Server({ server });
socketsInterface(wss);

server.listen(process.env.PORT || 8080);
