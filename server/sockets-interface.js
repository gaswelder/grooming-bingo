const { Grooming } = require("./grooming");

module.exports = function socketsInterface(wss) {
  /**
   * A Grooming instance for the current session.
   */
  const grooming = new Grooming();

  /**
   * The list of all connected sockets.
   */
  const sockets = [];

  function add(ws) {
    sockets.push({ ws });
    sendAll("users", sockets.map(s => s.user));
  }

  function remove(ws) {
    const pos = sockets.findIndex(s => s.ws == ws);
    sockets.splice(pos, 1);
    sendAll("users", sockets.map(s => s.user));
  }

  function auth(ws, user) {
    const pos = sockets.findIndex(s => s.ws == ws);
    sockets[pos].user = user;
    sendAll("users", sockets.map(s => s.user));
  }

  /**
   * Sends a message to all connected sockets.
   *
   * @param {string} type Message type
   * @param {any} val Message payload
   */
  function sendAll(type, val) {
    const message = JSON.stringify({ type, val });
    sockets.forEach(s => s.ws.send(message));
  }

  wss.on("connection", function connection(ws) {
    add(ws);
    ws.on("close", function() {
      remove(ws);
    });
    processSocket(ws);
  });

  function processSocket(ws) {
    let user;
    function send(type, val) {
      ws.send(JSON.stringify({ type, val }));
    }

    const handlers = {
      echo(val) {
        send("ohce", val);
      },
      auth(val) {
        user = val;
        send("init", grooming.state);
        auth(ws, user);
      },
      chat(val) {
        const msg = {
          author: user,
          text: val,
          timestamp: Date.now()
        };
        grooming.chat(msg);
        sendAll("chat", msg);
      },
      addAdvice(val) {
        const { ticketId, advice } = val;
        if (grooming.addAdvice(ticketId, advice)) {
          sendAll("tickets", grooming.state.tickets);
        }
      },
      removeAdvice(val) {
        const { ticketId, advice } = val;
        if (grooming.removeAdvice(ticketId, advice)) {
          sendAll("tickets", grooming.state.tickets);
        }
      },
      toggleVote(val) {
        const { ticketId, score } = val;
        if (grooming.toggleVote(user, ticketId, score)) {
          sendAll("tickets", grooming.state.tickets);
        }
      },
      deleteTicket(val) {
        const { ticketId } = val;
        if (grooming.deleteTicket(ticketId)) {
          sendAll("tickets", grooming.state.tickets);
        }
      },
      createTicket(val) {
        const { title } = val;
        grooming.createTicket(title);
        sendAll("tickets", grooming.state.tickets);
      }
    };
    ws.on("message", function incoming(message) {
      const msg = JSON.parse(message);
      console.log(msg);
      handlers[msg.type](msg.val);
    });
  }
};
