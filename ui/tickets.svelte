<script>
  import { onMount } from "svelte";
  import Votes from "./tickets/votes.svelte";
  import TechnicalDetails from "./tickets/technical-details.svelte";

  export let grooming;

  let newTicketName = "";
  let tickets = [];

  function deleteTicket(ticket) {
    if (!confirm(`delete ${ticket.title}?`)) {
      return;
    }
    grooming.deleteTicket(ticket.id);
  }

  function addTicket(event) {
    event.preventDefault();
    grooming.createTicket(newTicketName);
    newTicketName = "";
  }

  function toggleVote(ticket, score) {
    grooming.toggleVote(ticket.id, score);
  }

  grooming.onLoad(function(state) {
    tickets = state.tickets;
  });
  grooming.onTicketsChange(function(newTickets) {
    tickets = newTickets;
  });
</script>

{#each tickets as ticket}
  <div class="ticket">
    <h3>
      {ticket.title}
      <button name="delete" on:click={() => deleteTicket(ticket)}>
        &times;
      </button>
    </h3>
    <div>
      <TechnicalDetails
        {ticket}
        onAdd={advice => grooming.addAdvice(ticket.id, advice)}
        onRemove={advice => grooming.removeAdvice(ticket.id, advice)} />
      <Votes {ticket} onVote={score => toggleVote(ticket, score)} />
    </div>
  </div>
{/each}
<form on:submit={addTicket}>
  <input required bind:value={newTicketName} />
  <button>Add ticket</button>
</form>
