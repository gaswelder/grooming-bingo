import Users from "./users.svelte";
import Messages from "./chat/messages.svelte";
import Form from "./chat/form.svelte";

export default function initChat(grooming, container) {
  container.innerHTML = `<div></div>`;
  const div = container.querySelector("div");
  const usersContainer = document.createElement("span");
  const messages = document.createElement("div");
  div.appendChild(usersContainer);
  div.appendChild(messages);

  new Form({
    target: container,
    props: {
      onSubmit(text) {
        grooming.sendChatMessage(text);
      }
    }
  });

  const usersC = new Users({
    target: usersContainer,
    props: {
      users: []
    }
  });
  grooming.onUsersChange(users => {
    usersC.$set({ users });
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
