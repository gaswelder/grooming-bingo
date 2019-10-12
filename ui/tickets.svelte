<script>
  import { onMount } from "svelte";
  import Votes from "./tickets/votes.svelte";
  import TechnicalDetails from "./tickets/technical-details.svelte";
  import Ticket from "./tickets/ticket.svelte";

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
    const div = document.createElement("div");
    new Ticket({
      target: div,
      props: { ticket }
    });
    return div.innerHTML;
  }
</script>

<div bind:this={container} />
