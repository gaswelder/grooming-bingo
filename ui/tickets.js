// const ding = new Audio(
//   "https://notificationsounds.com/soundfiles/1bb91f73e9d31ea2830a5e73ce3ed328/file-sounds-1091-graceful.mp3"
// );

export default function initTickets(grooming, container) {
  grooming.onLoad(function(state) {
    container.innerHTML =
      state.tickets.map(renderTicket).join("") +
      `<form><input required><button>Add ticket</form>`;
  });
  grooming.onTicketsChange(function(tickets) {
    container.innerHTML =
      tickets.map(renderTicket).join("") +
      `<form><input required><button>Add ticket</form>`;
  });

  container.addEventListener("change", function(event) {
    if (event.target.className != "advice-toggle") {
      return;
    }
    event.target.checked = !event.target.checked;
    grooming.toggleAdvice(
      event.target.dataset.ticketId,
      event.target.dataset.advice
    );
  });

  container.addEventListener("submit", function(event) {
    event.preventDefault();
    const input = event.target.querySelector("input");
    const title = input.value;
    grooming.createTicket(title);
    title.value = "";
  });

  container.addEventListener("click", function(event) {
    if (event.target.className != "score") {
      return;
    }
    const { ticketId, score } = event.target.dataset;
    grooming.toggleVote(ticketId, score);
  });

  container.addEventListener("click", function(event) {
    if (event.target.tagName != "BUTTON" || event.target.name != "delete") {
      return;
    }
    if (!confirm("delete?")) {
      return;
    }
    const { ticketId } = event.target.dataset;
    grooming.deleteTicket(ticketId);
  });
}

const scores = [1, 2, 3, 5, 8, 13];

function renderTicket(ticket) {
  const votes = score =>
    ticket.votes
      .filter(vote => vote.score == score)
      .map(vote => vote.author)
      .join(", ");
  return `<div class="ticket">
                <h3>${ticket.title} <button name="delete" data-ticket-id="${
    ticket.id
  }">&times;</button></h3>
                <div>
                ${scores
                  .map(
                    score =>
                      `<div><button class="score" data-ticket-id="${
                        ticket.id
                      }" data-score="${score}" type="button">${score}</button> ${votes(
                        score
                      )}</div>`
                  )
                  .join("")}
                </div>
                <div>
                    ${renderTechnicalDetails(ticket)}
                </div>
            </div>`;
}

const specifications = [
  "it's very easy",
  "пропозаль",
  "папап",
  "I'm not sure",
  "it's a different card",
  "there's a card for that",
  "copypest",
  "exactly",
  "I have to look at the code",
  "makes sense",
  "does not make sense"
];

function renderTechnicalDetails(ticket) {
  const is = advice => ticket.advices.includes(advice);
  const id = i => `tn-${ticket.id}-${i}`;

  return (
    `<table>
      <caption>Implementation notes</caption>
      ` +
    specifications
      .map(
        (advice, i) =>
          `<tr><td><label for="${id(i)}">${advice}</label></td>
            <td>
            <input id="${id(i)}" data-ticket-id="${
            ticket.id
          }" data-advice="${advice}" class="advice-toggle" type="checkbox" ${
            is(advice) ? "checked" : ""
          }>
            </td></tr>`
      )
      .join("") +
    "</table>"
  );
}
