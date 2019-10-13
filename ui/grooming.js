import State from "../lib/state";
import { PersistentSocket } from "../lib/persistent-socket";

export class Grooming {
  constructor(username) {
    this.username = username;
    this.loadListeners = [];
    this.changeListeners = [];
    this.state1 = new State({});

    const url = location.host.includes("localhost")
      ? `ws://${location.host}/grooming`
      : `wss://${location.host}/grooming`;
    this.socket = new PersistentSocket(url);
    this.socket.onConnect(() => this.send("auth", this.username));
    this.socket.onMessage(message => {
      const msg = JSON.parse(message.data);
      this["_msg_" + msg.type].call(this, msg.val);
    });

    setInterval(() => {
      this.send("echo", Date.now());
    }, 10000);
  }

  onChange(f) {
    this.changeListeners.push(f);
  }

  onConnectionChange(f) {
    this.socket.onConnectionChange(f);
  }

  _msg_change(command) {
    this.state1.apply(command);
    this.changeListeners.forEach(f => f(this.state1.state));
  }

  _msg_ohce(data) {
    console.log("RTT time", Date.now() - data, "ms");
  }

  _msg_init(data) {
    this.state1 = new State(data);
    this.state = data;
    this.loadListeners.forEach(fn => fn(data));
    // this.state.chat.forEach(msg => this.chatListeners.forEach(fn => fn(msg)));
  }

  send(type, val) {
    const message = JSON.stringify({ type, val });
    this.socket.send(message);
  }
  onLoad(func) {
    this.loadListeners.push(func);
  }
  onChatMessage(func) {
    // this.chatListeners.push(func);
  }

  sendChatMessage(text) {
    this.send("chat", text);
  }
  addAdvice(ticketId, advice) {
    this.send("addAdvice", { ticketId, advice });
  }
  removeAdvice(ticketId, advice) {
    this.send("removeAdvice", { ticketId, advice });
  }
  toggleVote(ticketId, score) {
    this.send("toggleVote", { ticketId, score });
  }
  createTicket(title) {
    this.send("createTicket", { title });
  }
  deleteTicket(ticketId) {
    this.send("deleteTicket", { ticketId });
  }
}
