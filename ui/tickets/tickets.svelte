<script>
  import { onMount } from "svelte";
  import Ticket from "./ticket.svelte";
  import Card from "../lib/card.svelte";

  export let grooming;

  let newTicketName = "";
  let tickets = [];

  function addTicket(event) {
    event.preventDefault();
    newTicketName = newTicketName.trim();
    if (newTicketName != "") {
      grooming.createTicket(newTicketName);
    }
    newTicketName = "";
  }

  grooming.onLoad(function(state) {
    tickets = state.tickets;
  });
  grooming.onChange(function(state) {
    tickets = state.tickets;
  });
</script>

{#each tickets as ticket}
  <Ticket {ticket} {grooming} />
{/each}

<Card>
  <form on:submit={addTicket}>
    <input bind:value={newTicketName} />
    <button>Add ticket</button>
  </form>
</Card>
