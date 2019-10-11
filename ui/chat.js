import Users from "./users.svelte";
import Messages from "./chat/messages.svelte";

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

  let m = [];

  const messagesC = new Messages({
    target: messages,
    props: { messages: m }
  });

  grooming.onChatMessage(message => {
    m = m.concat(message);
    messagesC.$set({ messages: m });

    messages.scrollBy(0, 1e6);
    if (document.hidden && Notification.permission == "granted") {
      new Notification(`${message.author}: ${message.text}`);
    }
  });
}
