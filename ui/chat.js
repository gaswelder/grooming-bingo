export default function initChat(grooming, container) {
  container.innerHTML = `<div></div><form><textarea></textarea><button type="submit">Send (enter)</button></form>`;
  const form = container.querySelector("form");
  const textarea = container.querySelector("textarea");
  const messages = container.querySelector("div");

  function send() {
    grooming.sendChatMessage(textarea.value);
    textarea.value = "";
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    send();
  });

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
    const p = document.createElement("p");
    if (message.text == "@here") {
      Object.assign(p.style, {
        fontWeight: "bold",
        color: "chartreuse",
        background: "crimson",
        display: "inline-block"
      });
    }
    p.innerText = `${message.author}: ${message.text}`;
    messages.appendChild(p);
    messages.scrollBy(0, 1e6);
    if (document.hidden && Notification.permission == "granted") {
      new Notification(`${message.author}: ${message.text}`);
    }
  });
}
