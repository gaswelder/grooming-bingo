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

  wss.on("connection", function connection(ws) {
    sockets.push(ws);
    ws.on("close", function() {
      const pos = sockets.indexOf(ws);
      sockets.splice(pos, 1);
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

  /**
   * Sends a message to all connected sockets.
   *
   * @param {string} type Message type
   * @param {any} val Message payload
   */
  function sendAll(type, val) {
    const s = JSON.stringify({ type, val });
    sockets.forEach(ws => ws.send(s));
  }
};
