import Chat from "./chat/chat.svelte";

export default function initChat(grooming, container) {
  new Chat({
    target: container,
    props: {
      grooming
    }
  });

  grooming.onChatMessage(message => {
    if (document.hidden && Notification.permission == "granted") {
      new Notification(`${message.author}: ${message.text}`);
    }
  });
}
