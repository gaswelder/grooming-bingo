import { Grooming } from "./grooming";
import UI from "./ui.svelte";
import { play } from "./lib/sound";

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
      play("pop");
    }
    if (
      message.author &&
      document.hidden &&
      Notification.permission == "granted"
    ) {
      new Notification(`${message.author}: ${message.text}`);
    }
  });

  grooming.onChange((state, diffs) => {
    const re = /tickets\.\d+\.advices/;
    if (diffs.some(diff => diff.op == "add" && re.test(diff.path.join(".")))) {
      play("ding");
    }
  });

  new UI({
    target: root,
    props: {
      grooming
    }
  });
};
