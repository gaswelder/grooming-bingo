const banner = document.createElement("div");
banner.innerText = "Socket closed, reconnecting";
banner.class = "banner";
document.body.appendChild(banner);
Object.assign(banner.style, {
  position: "fixed",
  left: "50%",
  top: "50%",
  background: "crimson",
  color: "white",
  padding: "1em",
  borderRadius: "8px",
  display: "none"
});

function showBanner() {
  banner.style.display = "block";
}
function hideBanner() {
  banner.style.display = "none";
}

class Grooming {
  constructor(username) {
    this.username = username;
    this.connect();
    setInterval(() => {
      this._send("echo", Date.now());
    }, 10000);
  }

  connect() {
    const ws = new WebSocket(`ws://${location.host}/grooming`);
    ws.addEventListener("error", () => {
      setTimeout(() => this.connect(), 3000);
    });
    ws.addEventListener("open", () => {
      hideBanner();
      this._send("auth", this.username);
      ws.addEventListener("close", () => {
        this.ws = null;
        showBanner();
        this.connect();
      });
      ws.addEventListener("message", message => {
        const msg = JSON.parse(message.data);
        this["_msg_" + msg.type].call(this, msg.val);
      });
    });
    this.ws = ws;
  }

  _msg_ohce(data) {
    console.log("RTT time", Date.now() - data, "ms");
  }

  _msg_init(data) {
    this.state = data;
    this.onLoad();
    this.state.chat.forEach(msg => this.chatListeners.forEach(fn => fn(msg)));
  }

  _msg_chat(msg) {
    this.state.chat.push(msg);
    this.chatListeners.forEach(fn => fn(msg));
  }

  _send(type, val) {
    const data = { type, val };
    this.ws.send(JSON.stringify(data));
  }
  _msg_tickets(tickets) {
    this.state.tickets = tickets;
    this.ticketListeners.forEach(fn => fn(this.state.tickets));
  }
  onChatMessage(func) {
    this.chatListeners = [func];
  }
  onTicketsChange(func) {
    this.ticketListeners = [func];
    func(this.state.tickets);
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
  grooming.onLoad = function() {
    initChat(grooming, chatRoot);
    initTickets(grooming, ticketsRoot);
  };
};

function initChat(grooming, container) {
  container.innerHTML = `<div></div><form><textarea></textarea><button type="submit">Send (enter)</button></form>`;
  const form = container.querySelector("form");
  const textarea = container.querySelector("textarea");
  const messages = container.querySelector("div");

  function send() {
    grooming.sendChatMessage(textarea.value);
    textarea.value = "";
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    send();
  });

  container.addEventListener("keypress", function(event) {
    if (
      event.target.tagName != "TEXTAREA" ||
      event.key != "Enter" ||
      event.ctrlKey
    ) {
      return;
    }
    event.preventDefault();
    send();
  });

  grooming.onChatMessage(message => {
    const p = document.createElement("p");
    if (message.text == "@here") {
      Object.assign(p.style, {
        fontWeight: "bold",
        color: "chartreuse",
        background: "crimson",
        display: "inline-block"
      });
    }
    p.innerText = `${message.author}: ${message.text}`;
    messages.appendChild(p);
    messages.scrollBy(0, 1e6);
  });
}

function initTickets(grooming, container) {
  const scores = [1, 2, 3, 5, 8, 13];
  grooming.onTicketsChange(function(tickets) {
    container.innerHTML =
      tickets.map(renderTicket).join("") +
      `<form><input required><button>Add ticket</form>`;
  });

  container.addEventListener("change", function(event) {
    if (event.target.className != "advice-toggle") {
      return;
    }
    event.target.checked = !event.target.checked;
    grooming.toggleAdvice(
      event.target.dataset.ticketId,
      event.target.dataset.advice
    );
  });

  container.addEventListener("submit", function(event) {
    event.preventDefault();
    const input = event.target.querySelector("input");
    const title = input.value;
    grooming.createTicket(title);
    title.value = "";
  });

  container.addEventListener("click", function(event) {
    if (event.target.className != "score") {
      return;
    }
    const { ticketId, score } = event.target.dataset;
    grooming.toggleVote(ticketId, score);
  });

  container.addEventListener("click", function(event) {
    if (event.target.tagName != "BUTTON" || event.target.name != "delete") {
      return;
    }
    if (!confirm("delete?")) {
      return;
    }
    const { ticketId } = event.target.dataset;
    grooming.deleteTicket(ticketId);
  });

  function renderTicket(ticket) {
    const votes = score =>
      ticket.votes
        .filter(vote => vote.score == score)
        .map(vote => vote.author)
        .join(", ");
    return `<div class="ticket">
                <h3>${ticket.title} <button name="delete" data-ticket-id="${
      ticket.id
    }">&times;</button></h3>
                <div>
                ${scores
                  .map(
                    score =>
                      `<div><button class="score" data-ticket-id="${
                        ticket.id
                      }" data-score="${score}" type="button">${score}</button> ${votes(
                        score
                      )}</div>`
                  )
                  .join("")}
                </div>
                <div>
                    ${renderAdvices(ticket)}
                </div>
            </div>`;
  }

  function renderAdvices(ticket) {
    const advices = [
      "it's very easy",
      "пропозаль",
      "папап",
      "I'm not sure",
      "it's a different card",
      "there's a card for that",
      "copypest",
      "exactly",
      "I have to look at the code",
      "makes sense",
      "does not make sense"
    ];
    const is = advice => ticket.advices.includes(advice);
    const id = i => `tn-${ticket.id}-${i}`;

    return (
      `<table>
      <caption>Technical notes</caption>
      ` +
      advices
        .map(
          (advice, i) =>
            `<tr><td><label for="${id(i)}">${advice}</label></td>
            <td>
            <input id="${id(i)}" data-ticket-id="${
              ticket.id
            }" data-advice="${advice}" class="advice-toggle" type="checkbox" ${
              is(advice) ? "checked" : ""
            }>
            </td></tr>`
        )
        .join("") +
      "</table>"
    );
  }
}
