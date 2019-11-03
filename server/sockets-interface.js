module.exports = function socketsInterface(wss, grooming) {
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

  grooming.onChange(changes => {
    sendAll("changes", changes);
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
        send("settings", {
          specials: grooming.options.specialMessages
        });
        send("init", grooming.state);
        auth(ws, user);
        grooming.addUser(user);
      },
      chat(val) {
        grooming.chat(user, val);
      },
      addAdvice(val) {
        const { ticketId, advice } = val;
        grooming.addAdvice(ticketId, advice, user);
      },
      removeAdvice(val) {
        const { ticketId, advice } = val;
        grooming.removeAdvice(ticketId, advice, user);
      },
      toggleVote(val) {
        const { ticketId, score } = val;
        grooming.toggleVote(user, ticketId, score);
      },
      deleteTicket(val) {
        const { ticketId } = val;
        grooming.deleteTicket(ticketId, user);
      },
      createTicket(val) {
        const { title } = val;
        grooming.createTicket(title, user);
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
      console.log(user, "\t", msg);
      handlers[msg.type](msg.val);
    });
  }
};
