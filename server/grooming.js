const immer = require("immer");

const defaultOptions = {
  specialMessages: ["@here"]
};

exports.Grooming = class Grooming {
  constructor(options = {}) {
    this.state = {
      tickets: [],
      chat: [],
      users: []
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.changeListeners = [];
    this.createTicket("Пропозаль");
  }

  onChange(f) {
    this.changeListeners.push(f);
  }

  change(changer) {
    this.state = immer.produce(this.state, changer, changes => {
      this.changeListeners.forEach(f => f(changes));
    });
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
        timestamp: Date.now()
      });
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
