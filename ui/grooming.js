import State from "../lib/state";
import { PersistentSocket } from "../lib/persistent-socket";

function matchesFilter(change, filter = []) {
  const [path, op] = filter;
  if (op && op != change[0]) {
    return false;
  }
  if (path && !change[1].join(",").startsWith(path.join(","))) {
    return false;
  }
  return true;
}

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
      const { type, val } = JSON.parse(message.data);
      switch (type) {
        case "init":
          this.state1 = new State(val);
          this.state = val;
          this.loadListeners.forEach(fn => fn(val));
          break;
        case "change":
          this.state1.apply(val);
          this.changeListeners.forEach(listener => {
            if (matchesFilter(val, listener.filter)) {
              listener.f(this.state1.state);
            }
          });
          break;
        case "ohce":
          console.info("RTT time", Date.now() - val, "ms");
          break;
        default:
          console.warning("Unhandled message", type, val);
      }
    });

    setInterval(() => {
      this.send("echo", Date.now());
    }, 10000);
  }

  onChange(f, filter) {
    this.changeListeners.push({ f, filter });
  }
  onConnectionChange(f) {
    this.socket.onConnectionChange(f);
  }
  onLoad(func) {
    this.loadListeners.push(func);
  }
  onChatMessage(func) {
    // this.chatListeners.push(func);
  }

  send(type, val) {
    const message = JSON.stringify({ type, val });
    this.socket.send(message);
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
