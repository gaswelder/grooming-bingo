exports.Grooming = class Grooming {
  constructor() {
    this.state = {
      tickets: [
        {
          id: 1,
          title: "пропозаль",
          advices: [],
          votes: []
        }
      ],
      chat: []
    };
  }

  chat(msg) {
    this.state.chat.push(msg);
  }

  toggleAdvice(ticketId, advice) {
    const ticket = this.state.tickets.find(t => t.id == ticketId);
    if (!ticket) {
      return false;
    }
    const pos = ticket.advices.indexOf(advice);
    if (pos >= 0) {
      ticket.advices.splice(pos, 1);
    } else {
      ticket.advices.push(advice);
    }
    return true;
  }

  toggleVote(user, ticketId, score) {
    const ticket = this.state.tickets.find(t => t.id == ticketId);
    if (!ticket) {
      return false;
    }
    const pos = ticket.votes.findIndex(
      vote => vote.author == user && vote.score == score
    );
    if (pos >= 0) {
      ticket.votes.splice(pos);
    } else {
      ticket.votes.push({
        author: user,
        score
      });
    }
    return true;
  }

  deleteTicket(ticketId) {
    const pos = this.state.tickets.find(t => t.id == ticketId);
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
