export class Grooming {
  constructor(username) {
    this.username = username;
    this.queue = [];
    this.loadListeners = [];
    this.connectionListeners = [];
    this.connect();
    setInterval(() => {
      this._send("echo", Date.now());
    }, 10000);

    this.usersListeners = [];
  }

  onUsersChange(f) {
    this.usersListeners.push(f);
  }

  onConnectionChange(f) {
    this.connectionListeners.push(f);
  }

  setSocket(ws) {
    this.ws = ws;
    this.connectionListeners.forEach(f => f(ws != null));
  }

  url() {
    if (location.host.includes("localhost")) {
      return `ws://${location.host}/grooming`;
    }
    return `wss://${location.host}/grooming`;
  }

  connect() {
    const ws = new WebSocket(this.url());
    ws.addEventListener("error", () => {
      setTimeout(() => this.connect(), 3000);
    });
    ws.addEventListener("open", () => {
      ws.addEventListener("close", () => {
        this.setSocket(null);
        this.connect();
      });
      ws.addEventListener("message", message => {
        const msg = JSON.parse(message.data);
        this["_msg_" + msg.type].call(this, msg.val);
      });

      this.setSocket(ws);
      this._send("auth", this.username);
      const tail = this.queue;
      this.queue = [];
      tail.forEach(([type, val]) => this._send(type, val));
    });
  }

  _msg_users(users) {
    this.usersListeners.forEach(f => f(users));
  }

  _msg_ohce(data) {
    console.log("RTT time", Date.now() - data, "ms");
  }

  _msg_init(data) {
    this.state = data;
    this.loadListeners.forEach(fn => fn(data));
    this.state.chat.forEach(msg => this.chatListeners.forEach(fn => fn(msg)));
  }

  _msg_chat(msg) {
    this.state.chat.push(msg);
    this.chatListeners.forEach(fn => fn(msg));
  }

  _send(type, val) {
    if (!this.ws) {
      this.queue.push([type, val]);
    } else {
      const data = { type, val };
      this.ws.send(JSON.stringify(data));
    }
  }
  _msg_tickets(tickets) {
    this.state.tickets = tickets;
    this.ticketListeners.forEach(fn => fn(this.state.tickets));
  }
  onLoad(func) {
    this.loadListeners.push(func);
  }
  onChatMessage(func) {
    this.chatListeners = [func];
  }
  onTicketsChange(func) {
    this.ticketListeners = [func];
  }

  sendChatMessage(text) {
    this._send("chat", text);
  }
  addAdvice(ticketId, advice) {
    this._send("addAdvice", { ticketId, advice });
  }
  removeAdvice(ticketId, advice) {
    this._send("removeAdvice", { ticketId, advice });
  }
  toggleVote(ticketId, score) {
    this._send("toggleVote", { ticketId, score });
  }
  createTicket(title) {
    this._send("createTicket", { title });
  }
  deleteTicket(ticketId) {
    this._send("deleteTicket", { ticketId });
  }
}
