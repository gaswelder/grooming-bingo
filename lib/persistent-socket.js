export class PersistentSocket {
  constructor(url) {
    this.url = url;
    this.queue = [];
    this.ws = null;
    this.connectionListeners = [];
    this.messageListeners = [];
    this.connectListeners = [];
    setTimeout(() => this.connect(), 0);
  }

  onMessage(f) {
    this.messageListeners.push(f);
  }

  onConnectionChange(f) {
    this.connectionListeners.push(f);
  }

  onConnect(f) {
    this.connectListeners.push(f);
  }

  connect() {
    const ws = new WebSocket(this.url);
    ws.addEventListener("error", () => {
      setTimeout(() => this.connect(), 3000);
    });
    ws.addEventListener("close", () => {
      this.setSocket(null);
      this.connect();
    });
    ws.addEventListener("open", () => {
      this.setSocket(ws);
      this.connectListeners.forEach(f => f());
      const tail = this.queue;
      this.queue = [];
      tail.forEach(message => ws.send(message));
    });
    this.messageListeners.forEach(fn => ws.addEventListener("message", fn));
  }

  send(message) {
    if (!this.ws) {
      this.queue.push(message);
    } else {
      this.ws.send(message);
    }
  }

  setSocket(ws) {
    this.ws = ws;
    this.connectionListeners.forEach(f => f(ws != null));
  }
}
