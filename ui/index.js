import { Grooming } from "./grooming";
import UI from "./ui.svelte";

const ding = new Audio(
  "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3"
);

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
    if (message.author && message.author != grooming.username) {
      ding.play();
    }
    if (
      message.author &&
      document.hidden &&
      Notification.permission == "granted"
    ) {
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
