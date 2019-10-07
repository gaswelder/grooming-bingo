const http = require("http");
const ws = require("ws");
const fs = require("fs");
const util = require("util");
const { Grooming } = require("./server/grooming");

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

const grooming = new Grooming();
const sockets = [];

wss.on("connection", function connection(ws) {
  sockets.push(ws);
  ws.on("close", function() {
    const pos = sockets.indexOf(ws);
    sockets.splice(pos, 1);
  });
  let user;
  function send(type, val) {
    ws.send(JSON.stringify({ type, val }));
  }
  function sendAll(type, val) {
    const s = JSON.stringify({ type, val });
    sockets.forEach(ws => ws.send(s));
  }
  const handlers = {
    echo(val) {
      send("ohce", val);
    },
    auth(val) {
      user = val;
      send("init", grooming.state);
    },
    chat(val) {
      const msg = {
        author: user,
        text: val
      };
      grooming.state.chat.push(msg);
      sendAll("chat", msg);
    },
    toggleAdvice(val) {
      const { ticketId, advice } = val;
      const ticket = grooming.state.tickets.find(t => t.id == ticketId);
      if (!ticket) {
        return;
      }
      const pos = ticket.advices.indexOf(advice);
      if (pos >= 0) {
        ticket.advices.splice(pos, 1);
      } else {
        ticket.advices.push(advice);
      }
      sendAll("tickets", grooming.state.tickets);
    },
    toggleVote(val) {
      const { ticketId, score } = val;
      const ticket = grooming.state.tickets.find(t => t.id == ticketId);
      if (!ticket) {
        return;
      }
      const pos = ticket.votes.findIndex(
        vote => vote.author == user && vote.score == score
      );
      if (pos >= 0) {
        ticket.votes.splice(pos);
      } else {
        ticket.votes.push({
          author: user,
          score
        });
      }
      sendAll("tickets", grooming.state.tickets);
    },
    deleteTicket(val) {
      const { ticketId } = val;
      const pos = grooming.state.tickets.find(t => t.id == ticketId);
      if (pos < 0) {
        return;
      }
      grooming.state.tickets.splice(pos, 1);
      sendAll("tickets", grooming.state.tickets);
    },
    createTicket(val) {
      grooming.state.tickets.push({
        id: Date.now(),
        title: val.title,
        advices: [],
        votes: []
      });
      sendAll("tickets", grooming.state.tickets);
    }
  };
  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    console.log(msg);
    handlers[msg.type](msg.val);
  });
});

server.listen(process.env.PORT || 8080);
