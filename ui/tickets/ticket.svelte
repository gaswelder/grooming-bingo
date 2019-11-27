<script>
  import { onMount } from "svelte";
  import Votes from "./votes.svelte";
  import TechnicalDetail from "./technical-detail.svelte";
  import Menu from "./menu.svelte";
  import Card from "../lib/card.svelte";
  import Editable from "../lib/editable.svelte";

  export let ticket, grooming;

  function deleteTicket(ticket) {
    if (!confirm(`delete ${ticket.title}?`)) {
      return;
    }
    grooming.deleteTicket(ticket.id);
  }

  function toggleVote(ticket, score) {
    grooming.toggleVote(ticket.id, score);
  }

  function onTitleChange(event) {
    grooming.renameTicket(ticket.id, event.detail.newValue);
  }
</script>

<style>
  button[name="delete"] {
    display: block;
    border: none;
    font-size: 20px;
    font-weight: normal;
    width: 20px;
    height: 20px;
    padding: 0px;
    color: #6b778c;
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 8px;
    background: transparent;
  }
  button[name="delete"]:hover {
    background: rgba(9, 30, 66, 0.08);
  }
</style>

<Card>
  <h3>
    <Editable text={ticket.title} on:change={onTitleChange} />
    <button name="delete" on:click={() => deleteTicket(ticket)}>&times;</button>
  </h3>

  <h4>Technical details</h4>
  {#each Object.keys(ticket.advices) as advice}
    <TechnicalDetail
      text={advice}
      count={ticket.advices[advice]}
      on:minus={() => grooming.removeAdvice(ticket.id, advice)}
      on:plus={() => grooming.addAdvice(ticket.id, advice)} />
  {/each}
  <Menu
    onSelect={advice => grooming.addAdvice(ticket.id, advice)}
    selected={Object.keys(ticket.advices)} />
  <h4>Votes</h4>
  <Votes {ticket} onVote={score => toggleVote(ticket, score)} />
</Card>
