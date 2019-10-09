import { elem } from "./elem";

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
  return elem("p", [
    renderTime(message),
    message.author + ": ",
    renderText(message)
  ]);
}

function renderTime(message) {
  const time = document.createElement("time");
  time.innerText = formatTime(message.timestamp);
  return time;

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
}

function renderText(message) {
  const text = document.createElement("span");
  if (specials.includes(message.text)) {
    Object.assign(text.style, {
      fontWeight: "bold",
      color: "chartreuse",
      background: "crimson"
    });
  }
  let t = message.text;
  for (const url of findLinks(t)) {
    t = t.replace(url, `<a target="_blank" href="${url}">${url}</a>`);
  }
  text.innerHTML = t;
  return text;

  function findLinks(text) {
    const p = /https?:\/\/\w+\.\w+(\.\w+)*/g;
    const unique = a => [...new Set(a)];
    return unique([...text.matchAll(p)].map(m => m[0]));
  }
}
