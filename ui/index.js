import Chat from "./chat/chat.svelte";
import Banner from "./banner.svelte";
import initTickets from "./tickets";
import { Grooming } from "./grooming";

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

  Notification.requestPermission();

  const grooming = new Grooming(username);

  new Chat({
    target: chatRoot,
    props: {
      grooming
    }
  });

  grooming.onChatMessage(message => {
    if (document.hidden && Notification.permission == "granted") {
      new Notification(`${message.author}: ${message.text}`);
    }
  });

  initTickets(grooming, ticketsRoot);

  const banner = new Banner({
    target: document.body,
    props: {
      online: false
    }
  });

  grooming.onConnectionChange(function(online) {
    banner.$set({ online });
  });
};
