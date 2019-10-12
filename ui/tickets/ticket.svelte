<script>
  import Votes from "./votes.svelte";
  import TechnicalDetails from "./technical-details.svelte";
  export let ticket;
</script>

<div class="ticket">
  <h3>
    {ticket.title}
    <button name="delete" data-ticket-id={ticket.id}>&times;</button>
  </h3>
  <div>
    <TechnicalDetails {ticket} />
    <Votes {ticket} />
  </div>
</div>
