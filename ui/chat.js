const specials = ["@here", "@ashkan", "@kek", "@topkek"];

export default function initChat(grooming, container) {
  container.innerHTML = `<div></div><form><textarea></textarea><button type="submit">Send (enter)</button></form>`;
  const form = container.querySelector("form");
  const textarea = container.querySelector("textarea");
  const messages = container.querySelector("div");

  form.addEventListener("submit", event => {
    event.preventDefault();
    send();
  });

  function send() {
    grooming.sendChatMessage(textarea.value);
    textarea.value = "";
  }

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

  grooming.onLoad(() => {
    messages.innerHTML = "";
  });

  grooming.onChatMessage(message => {
    messages.appendChild(render(message));
    messages.scrollBy(0, 1e6);
    if (document.hidden && Notification.permission == "granted") {
      new Notification(`${message.author}: ${message.text}`);
    }
  });
}

function render(message) {
  const p = document.createElement("p");

  const time = document.createElement("time");
  time.innerText = formatTime(message.timestamp);

  const text = document.createElement("span");
  if (specials.includes(message.text)) {
    Object.assign(text.style, {
      fontWeight: "bold",
      color: "chartreuse",
      background: "crimson"
    });
  }
  text.innerText = `${message.author}: ${message.text}`;

  p.appendChild(time);
  p.appendChild(text);
  return p;
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return [
    d
      .getHours()
      .toString()
      .padStart(2, "0"),
    d
      .getMinutes()
      .toString()
      .padStart(2, "0")
  ].join(":");
}
