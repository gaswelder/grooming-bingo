import { PersistentSocket } from "../lib/persistent-socket";
import { applyPatches } from "immer";

export class Grooming {
  constructor(username) {
    this.username = username;
    this.loadListeners = [];
    this.changeListeners = [];
    this.state = undefined;
    this.specialMessages = null;

    const url = location.host.includes("localhost")
      ? `ws://${location.host}/grooming`
      : `wss://${location.host}/grooming`;
    this.socket = new PersistentSocket(url);
    this.socket.onConnect(() => {
      this.send("auth", this.username);
      if (this.state) {
        this.send("state", this.state);
      }
    });
    this.socket.onMessage(message => {
      const { type, val } = JSON.parse(message.data);
      switch (type) {
        case "settings":
          this.specialMessages = val.specials;
          break;
        case "init":
          this.state = val;
          this.loadListeners.forEach(fn => fn(val));
          break;
        case "changes":
          this.state = applyPatches(this.state, val);
          this.changeListeners.forEach(listener => {
            listener.f(this.state, val);
          });
          break;
        case "ohce":
          console.info("RTT time", Date.now() - val, "ms");
          break;
        default:
          console.warn("Unhandled message", type, val);
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
    this.onChange(
      function(state, val) {
        const messages = val
          .filter(change => change.op == "add" && change.path[0] == "chat")
          .map(change => change.value);
        messages.forEach(m => func(m));
      },
      [["chat"]]
    );
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
  renameTicket(ticketId, newTitle) {
    this.send("renameTicket", { ticketId, newTitle });
  }
  deleteTicket(ticketId) {
    this.send("deleteTicket", { ticketId });
  }
  startTyping() {
    this.send("startTyping");
  }
  stopTyping() {
    this.send("stopTyping");
  }
}
