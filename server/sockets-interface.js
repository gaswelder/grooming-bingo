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
  }

  function remove(ws) {
    const pos = sockets.findIndex(s => s.ws == ws);
    sockets.splice(pos, 1);
  }

  function auth(ws, user) {
    const pos = sockets.findIndex(s => s.ws == ws);
    sockets[pos].user = user;
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

  grooming.onChange(change => {
    sendAll("change", change);
  });

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

    ws.on("close", function() {
      grooming.removeUser(user);
    });

    const handlers = {
      echo(val) {
        send("ohce", val);
      },
      auth(val) {
        user = val;
        send("init", grooming.state);
        auth(ws, user);
        grooming.addUser(user);
      },
      chat(val) {
        const msg = {
          author: user,
          text: val,
          timestamp: Date.now()
        };
        grooming.chat(msg);
      },
      addAdvice(val) {
        const { ticketId, advice } = val;
        grooming.addAdvice(ticketId, advice);
      },
      removeAdvice(val) {
        const { ticketId, advice } = val;
        grooming.removeAdvice(ticketId, advice);
      },
      toggleVote(val) {
        const { ticketId, score } = val;
        grooming.toggleVote(user, ticketId, score);
      },
      deleteTicket(val) {
        const { ticketId } = val;
        grooming.deleteTicket(ticketId);
      },
      createTicket(val) {
        const { title } = val;
        grooming.createTicket(title);
      },
      startTyping() {
        grooming.startTyping(user);
      },
      stopTyping() {
        grooming.stopTyping(user);
      }
    };
    ws.on("message", function incoming(message) {
      const msg = JSON.parse(message);
      console.log(msg);
      handlers[msg.type](msg.val);
    });
  }
};
