<script>
  import { onMount } from "svelte";

  export let grooming;
  let container;

  onMount(() => {
    console.log("ok");
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
      event.target.value = "";
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

    container.addEventListener("click", function(event) {
      if (event.target.tagName != "BUTTON") {
        return;
      }
      const { ticketId, advice } = event.target.dataset;

      switch (event.target.name) {
        case "remove-advice":
          grooming.removeAdvice(ticketId, advice);
          break;
        case "add-advice":
          grooming.addAdvice(ticketId, advice);
          break;
      }
    });
  });

  const scores = [1, 2, 3, 5, 8, 13].reverse();

  function renderTicket(ticket) {
    return `<div class="ticket">
    <h3>${ticket.title} <button name="delete" data-ticket-id="${
      ticket.id
    }">&times;</button></h3>
      <div>
      ${renderTechnicalDetails(ticket)}
      ${renderVotes(ticket)}
      </div>
    </div>`;
  }

  function renderVotes(ticket) {
    const votes = score =>
      ticket.votes
        .filter(vote => vote.score == score)
        .map(vote => vote.author)
        .join(", ");

    return `<div class="votes">
    <h4>Votes</h4>
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
    return (
      `<div class="notes">
      <h4>Implementation notes</h4>` +
      specifications.map(advice => renderRow(ticket, advice)).join("") +
      "</div>"
    );
  }

  function renderRow(ticket, advice) {
    const count = ticket.advices[advice];
    return `<div class="advice-row ${count ? "active" : ""}">
  ${advice}
  ${renderChecks(count)}
  <button name="remove-advice" data-advice="${advice}" data-ticket-id="${
      ticket.id
    }">&minus;</button>
  <button name="add-advice" data-advice="${advice}" data-ticket-id="${
      ticket.id
    }">+</button>
  </div>`;
  }

  function renderChecks(count) {
    if (!count) {
      return "";
    }
    let s = "";
    const n = Math.ceil(count / 2);
    for (let i = 0; i < n; i++) {
      s += "+";
    }
    return s;
  }
</script>

<div bind:this={container} />
