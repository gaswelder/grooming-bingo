import Chat from "./chat/chat.svelte";
import Banner from "./banner.svelte";
import { Grooming } from "./grooming";
import Tickets from "./tickets/tickets.svelte";

// const ding = new Audio(
//   "https://notificationsounds.com/soundfiles/1bb91f73e9d31ea2830a5e73ce3ed328/file-sounds-1091-graceful.mp3"
// );

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

  new Tickets({
    target: ticketsRoot,
    props: { grooming }
  });

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
