<script>
  import { onMount } from "svelte";
  import Ticket from "./ticket.svelte";

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

<style>
  form {
    display: inline-block;
    background: rgba(255, 255, 255, 0.93);
    border-radius: 3px;
    padding: 1em;
    margin: 0.5em;
    box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
    margin-bottom: 8px;
    min-height: 20px;
    min-width: 170px;
    position: relative;
    vertical-align: top;
  }
</style>

{#each tickets as ticket}
  <Ticket {ticket} {grooming} />
{/each}

<form on:submit={addTicket} class="ticket">
  <input bind:value={newTicketName} />
  <button>Add ticket</button>
</form>
