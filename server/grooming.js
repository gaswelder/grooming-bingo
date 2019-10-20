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
    const ticketPos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (ticketPos < 0) {
      return false;
    }
    const ticket = this.state.tickets[ticketPos];
    const votePos = ticket.votes.findIndex(
      v => v.author == user && v.score == score
    );
    // If this is an existing vote, just remove it.
    if (votePos >= 0) {
      this.change(state => {
        state.tickets[ticketPos].votes.splice(votePos, 1);
      });
      return true;
    }

    // If the user is adding another vote, make sure the result
    // is not more than two votes.
    // Keep only one old vote that is closest to the new vote
    const existingScores = ticket.votes
      .filter(vote => vote.author == user)
      .map(vote => vote.score)
      .sort((a, b) => Math.abs(b - score) - Math.abs(a - score));
    const remove = s => {
      const newVotes = ticket.votes.filter(
        v => v.author == user && v.score == s
      );
      this.change(state => {
        state.tickets[ticketPos].votes = newVotes;
      });
    };
    existingScores.slice(1).forEach(remove);

    this.change(state => {
      state.tickets[ticketPos].votes.push({
        author: user,
        score
      });
    });
    return true;
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
