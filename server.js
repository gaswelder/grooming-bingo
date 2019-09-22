const http = require("http");
const ws = require("ws");
const fs = require("fs");

const indexPage = fs.readFileSync(__dirname + "/index.html");
const groomingScript = fs.readFileSync(__dirname + "/grooming.js");

const server = http.createServer(function(req, res) {
  if (req.url == "/") {
    res.write(indexPage);
    res.end();
    return;
  }
  if (req.url == "/grooming.js") {
    res.write(groomingScript);
    res.end();
    return;
  }
  res.write("nothing is here");
  res.end();
});
const wss = new ws.Server({ server });

const state = {
  tickets: [
    {
      id: 1,
      title: "пропозаль",
      advices: [],
      votes: []
    }
  ],
  chat: []
};

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
    auth(val) {
      user = val;
      send("init", state);
    },
    chat(val) {
      const msg = {
        author: user,
        text: val
      };
      state.chat.push(msg);
      sendAll("chat", msg);
    },
    toggleAdvice(val) {
      const { ticketId, advice } = val;
      const ticket = state.tickets.find(t => t.id == ticketId);
      const pos = ticket.advices.indexOf(advice);
      if (pos >= 0) {
        ticket.advices.splice(pos, 1);
      } else {
        ticket.advices.push(advice);
      }
      sendAll("tickets", state.tickets);
    },
    toggleVote(val) {
      const { ticketId, score } = val;
      const ticket = state.tickets.find(t => t.id == ticketId);
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
      sendAll("tickets", state.tickets);
    },
    createTicket(val) {
      state.tickets.push({
        id: Date.now(),
        title: val.title,
        advices: [],
        votes: []
      });
      sendAll("tickets", state.tickets);
    }
  };
  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    console.log(msg);
    handlers[msg.type](msg.val);
  });
});

server.listen(8080);
