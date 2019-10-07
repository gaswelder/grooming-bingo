import initChat from "./chat";
import initTickets from "./tickets";
import initBanner from "./banner";

class Grooming {
  constructor(username) {
    this.username = username;
    this.queue = [];
    this.loadListeners = [];
    this.connectionListeners = [];
    this.connect();
    setInterval(() => {
      this._send("echo", Date.now());
    }, 10000);
  }

  onConnectionChange(f) {
    this.connectionListeners.push(f);
  }

  setSocket(ws) {
    this.ws = ws;
    this.connectionListeners.forEach(f => f(ws != null));
  }

  connect() {
    const ws = new WebSocket(`ws://${location.host}/grooming`);
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
  toggleAdvice(ticketId, advice) {
    this._send("toggleAdvice", { ticketId, advice });
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

Notification.requestPermission();

window.initGrooming = function(root) {
  const chatRoot = document.createElement("div");
  chatRoot.className = "chatRoot";
  const ticketsRoot = document.createElement("div");
  ticketsRoot.className = "ticketsRoot";

  root.appendChild(ticketsRoot);
  root.appendChild(chatRoot);

  let username = localStorage.getItem("username");
  while (!username) {
    username = this.prompt("please enter your name");
    if (username) {
      localStorage.setItem("username", username);
    }
  }

  const grooming = new Grooming(username);
  initChat(grooming, chatRoot);
  initTickets(grooming, ticketsRoot);
  initBanner(grooming);
};
