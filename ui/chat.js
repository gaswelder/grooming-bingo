import { elem } from "./elem";
import Users from "./users.svelte";
import Text from "./chat/text.svelte";

export default function initChat(grooming, container) {
  container.innerHTML = `<div></div><form><textarea></textarea><button type="submit">Send (enter)</button></form>`;
  const form = container.querySelector("form");
  const textarea = container.querySelector("textarea");
  const div = container.querySelector("div");
  const usersContainer = document.createElement("span");
  const messages = document.createElement("div");
  div.appendChild(usersContainer);
  div.appendChild(messages);

  const usersC = new Users({
    target: usersContainer,
    props: {
      users: []
    }
  });
  grooming.onUsersChange(users => {
    usersC.$set({ users });
  });

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
  new Text({
    target: text,
    props: {
      message
    }
  });
  return text;
}
