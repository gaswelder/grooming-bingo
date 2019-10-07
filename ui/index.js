import initChat from "./chat";
import initTickets from "./tickets";
import initBanner from "./banner";
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
  initChat(grooming, chatRoot);
  initTickets(grooming, ticketsRoot);
  initBanner(grooming);
};
