const immer = require("immer");

const defaultOptions = {
  specialMessages: ["@here"]
};

exports.Grooming = class Grooming {
  constructor(options = {}) {
    this.creationTime = Date.now();
    this.state = {
      tickets: [],
      chat: [],
      users: []
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.changeListeners = [];
  }

  onChange(f) {
    this.changeListeners.push(f);
  }

  change(changer) {
    this.state = immer.produce(this.state, changer, changes => {
      this.changeListeners.forEach(f => f(changes));
    });
  }

  restoreState(state) {
    if (Date.now() - this.creationTime > 5000) {
      return;
    }
    console.log("restoring state");
    this.change(() => state);
  }

  addUser(username) {
    this.change(state => {
      state.users.push({
        name: username,
        typing: false
      });
      this._systemMessage(`${username} connected`);
    });
  }

  removeUser(username) {
    this.change(state => {
      state.users = state.users.filter(u => u.name != username);
      this._systemMessage(`${username} disconnected`);
    });
  }

  chat(author, text) {
    this.change(state => {
      state.chat.push({
        author,
        text,
        timestamp: Date.now(),
        edited: false
      });
    });
  }

  editChatMessage(author, newText) {
    this.change(state => {
      let pos = state.chat.length - 1;
      while (pos >= 0 && state.chat[pos].author != author) {
        pos--;
      }
      if (pos < 0) {
        return;
      }
      state.chat[pos].text = newText;
      state.chat[pos].edited = true;
    });
  }

  setMap(mapName) {
    const maps = {
      q3dm6:
        "https://vignette.wikia.nocookie.net/quake/images/1/18/Q3DM6.jpg/revision/latest?cb=20150511122543",
      q3dm13:
        "https://vignette.wikia.nocookie.net/quake/images/5/52/Q3DM13.jpg/revision/latest?cb=20150518133645",
      q3dm17:
        "https://vignette.wikia.nocookie.net/quake3/images/c/c7/Dm17_fullshot.jpg/revision/latest?cb=20100214045500",
      ztn3tourney1:
        "https://lvlworld.com/levels/ztn3tourney1/ztn3tourney1lg.jpg",
      cs_assault:
        "https://vignette.wikia.nocookie.net/cswikia/images/0/00/Cs_assault_go.png/revision/latest?cb=20140819095651",
      cs_italy:
        "https://vignette.wikia.nocookie.net/cswikia/images/2/2c/Cs_italy_csgo.png/revision/latest?cb=20140819100829",
      cs_office:
        "https://vignette.wikia.nocookie.net/cswikia/images/f/f7/Csgo-cs-office.png/revision/latest?cb=20140820132335",
      de_dust:
        "https://vignette.wikia.nocookie.net/cswikia/images/6/6d/Csgo-de-dust.png/revision/latest?cb=20140820131343"
    };
    this.change(state => {
      state.map = maps[mapName];
    });
  }

  _systemMessage(text) {
    setImmediate(() => this.chat(null, text));
  }

  addAdvice(ticketId, advice, user) {
    this.change(state => {
      const pos = state.tickets.findIndex(t => t.id == ticketId);
      if (pos < 0) {
        return;
      }
      const current = state.tickets[pos].advices[advice] || 0;
      state.tickets[pos].advices[advice] = Math.min(current + 1, 6);

      if (current == 0) {
        this._systemMessage(user + " added advice " + advice);
      }
    });
  }

  removeAdvice(ticketId, advice, user) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return;
    }
    const newVal = (this.state.tickets[pos].advices[advice] || 0) - 1;
    this.change(state => {
      if (newVal <= 0) {
        delete state.tickets[pos].advices[advice];
        this._systemMessage(user + " removed advice " + advice);
      } else {
        state.tickets[pos].advices[advice] = newVal;
      }
    });
  }

  toggleVote(user, ticketId, score) {
    this.change(state => {
      const ticket = state.tickets.find(t => t.id == ticketId);
      if (!ticket) {
        return;
      }
      const pos = ticket.votes.findIndex(
        v => v.author == user && v.score == score
      );
      // If this is the same vote, remove it (withdraw vote).
      // Otherwise set the new vote.
      if (pos >= 0) {
        this._systemMessage(`${user} removed a vote from ${ticket.title}`);
        ticket.votes.splice(pos, 1);
      } else {
        this._systemMessage(`${user} voted ${score} on ${ticket.title}`);
        ticket.votes = ticket.votes
          .filter(v => v.author != user)
          .concat({
            author: user,
            score
          });
      }
    });
  }

  deleteTicket(ticketId, user) {
    this.change(state => {
      const pos = state.tickets.findIndex(t => t.id == ticketId);
      if (pos < 0) {
        return;
      }
      const ticket = state.tickets[pos];
      state.tickets.splice(pos, 1);
      this._systemMessage(`${user} deleted ${ticket.title}`);
    });
  }

  createTicket(title, user) {
    this.change(state => {
      state.tickets.push({
        id: Date.now(),
        title,
        advices: {},
        votes: []
      });
    });
    if (user) {
      this._systemMessage(`${user} added ticket ${title}`);
    }
  }

  renameTicket(ticketId, newTitle, user) {
    this.change(state => {
      const ticket = state.tickets.find(t => t.id == ticketId);
      if (!ticket) {
        return;
      }
      const oldTitle = ticket.title;
      ticket.title = newTitle;
      this._systemMessage(`${user} renamed ${oldTitle} to ${newTitle}`);
    });
  }

  startTyping(name) {
    const pos = this.state.users.findIndex(u => u.name == name);
    if (pos < 0) {
      return;
    }
    this.change(state => {
      state.users[pos].typing = true;
    });
  }

  stopTyping(name) {
    const pos = this.state.users.findIndex(u => u.name == name);
    if (pos < 0) {
      return;
    }
    this.change(state => {
      state.users[pos].typing = false;
    });
  }
};
