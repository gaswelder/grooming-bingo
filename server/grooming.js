exports.Grooming = class Grooming {
  constructor() {
    this.state = {
      tickets: [
        {
          id: 1,
          title: "пропозаль",
          advices: {},
          votes: []
        }
      ],
      chat: []
    };
  }

  chat(msg) {
    this.state.chat.push(msg);
  }

  addAdvice(ticketId, advice) {
    const ticket = this.state.tickets.find(t => t.id == ticketId);
    if (!ticket) {
      return false;
    }
    if (!ticket.advices[advice]) {
      ticket.advices[advice] = 1;
    } else {
      ticket.advices[advice]++;
    }
    return true;
  }

  removeAdvice(ticketId, advice) {
    const ticket = this.state.tickets.find(t => t.id == ticketId);
    if (!ticket) {
      return false;
    }
    if (ticket.advices[advice]) {
      ticket.advices[advice]--;
    }
    return true;
  }

  toggleVote(user, ticketId, score) {
    const ticket = this.state.tickets.find(t => t.id == ticketId);
    if (!ticket) {
      return false;
    }
    const pos = ticket.votes.findIndex(
      v => v.author == user && v.score == score
    );
    // If this is an existing vote, just remove it.
    if (pos >= 0) {
      ticket.votes.splice(pos, 1);
      return true;
    }

    // If the user is adding another vote, make sure the result
    // is not more than two votes.
    // Keep only one old vote that is closest to the new vote
    const existingScores = ticket.votes
      .filter(vote => vote.author == user)
      .map(vote => vote.score)
      .sort((a, b) => Math.abs(b - score) - Math.abs(a - score));
    const remove = s =>
      (ticket.votes = ticket.votes.filter(
        v => v.author == user && v.score == s
      ));
    existingScores.slice(1).forEach(remove);

    ticket.votes.push({
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
    this.state.tickets.splice(pos, 1);
    return true;
  }

  createTicket(title) {
    this.state.tickets.push({
      id: Date.now(),
      title,
      advices: [],
      votes: []
    });
  }
};
