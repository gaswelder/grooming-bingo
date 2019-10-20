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
    });
  }

  removeUser(username) {
    this.change(state => {
      state.users = state.users.filter(u => u.name != username);
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

  addAdvice(ticketId, advice) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return;
    }
    this.change(state => {
      state.tickets[pos].advices[advice] =
        (state.tickets[pos].advices[advice] || 0) + 1;
    });
  }

  removeAdvice(ticketId, advice) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return;
    }
    const newVal = (this.state.tickets[pos].advices[advice] || 0) - 1;
    this.change(state => {
      if (newVal <= 0) {
        delete state.tickets[pos].advices[advice];
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
        ticket.votes.splice(pos, 1);
      } else {
        ticket.votes = ticket.votes
          .filter(v => v.author != user)
          .concat({
            author: user,
            score
          });
      }
    });
  }

  deleteTicket(ticketId) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return false;
    }
    this.change(state => {
      state.tickets.splice(pos, 1);
    });
    return true;
  }

  createTicket(title) {
    this.change(state => {
      state.tickets.push({
        id: Date.now(),
        title,
        advices: {},
        votes: []
      });
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
