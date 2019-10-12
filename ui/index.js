import { Grooming } from "./grooming";
import UI from "./ui.svelte";

// const ding = new Audio(
//   "https://notificationsounds.com/soundfiles/1bb91f73e9d31ea2830a5e73ce3ed328/file-sounds-1091-graceful.mp3"
// );

window.initGrooming = function(root) {
  let username = localStorage.getItem("username");
  while (!username) {
    username = this.prompt("please enter your name");
    if (username) {
      localStorage.setItem("username", username);
    }
  }

  const grooming = new Grooming(username);

  Notification.requestPermission();
  grooming.onChatMessage(message => {
    if (document.hidden && Notification.permission == "granted") {
      new Notification(`${message.author}: ${message.text}`);
    }
  });

  new UI({
    target: root,
    props: {
      grooming
    }
  });
};
