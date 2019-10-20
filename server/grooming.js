const State = require("../lib/state");

exports.Grooming = class Grooming extends State {
  constructor() {
    super({
      tickets: [],
      chat: [],
      users: []
    });
    this.createTicket("Пропозаль");
  }

  addUser(username) {
    this.push(["users"], {
      name: username,
      typing: false
    });
  }

  removeUser(username) {
    const pos = this.state.users.findIndex(u => u.name == username);
    this.del(["users", pos]);
  }

  chat(author, text) {
    this.push(["chat"], {
      author,
      text,
      timestamp: Date.now()
    });
  }

  addAdvice(ticketId, advice) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return false;
    }
    const newVal = (this.state.tickets[pos].advices[advice] || 0) + 1;
    this.set(["tickets", pos, "advices", advice], newVal);
    return true;
  }

  removeAdvice(ticketId, advice) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return false;
    }
    const newVal = (this.state.tickets[pos].advices[advice] || 0) - 1;
    if (newVal <= 0) {
      this.del(["tickets", pos, "advices", advice]);
      return true;
    }
    this.set(["tickets", pos, "advices", advice], newVal);
    return true;
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
      this.del(["tickets", ticketPos, "votes", votePos]);
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
      this.set(["tickets", ticketPos, "votes"], newVotes);
    };
    existingScores.slice(1).forEach(remove);

    this.push(["tickets", ticketPos, "votes"], {
      author: user,
      score
    });
    return true;
  }

  deleteTicket(ticketId) {
    const pos = this.state.tickets.findIndex(t => t.id == ticketId);
    if (pos < 0) {
      return false;
    }
    this.del(["tickets", pos]);
    return true;
  }

  createTicket(title) {
    this.push(["tickets"], {
      id: Date.now(),
      title,
      advices: {},
      votes: []
    });
  }

  startTyping(name) {
    const pos = this.state.users.findIndex(u => u.name == name);
    if (pos < 0) {
      return;
    }
    this.set(["users", pos, "typing"], true);
  }

  stopTyping(name) {
    const pos = this.state.users.findIndex(u => u.name == name);
    if (pos < 0) {
      return;
    }
    this.set(["users", pos, "typing"], false);
  }
};
