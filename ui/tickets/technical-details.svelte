<script>
  import { onMount } from "svelte";
  export let ticket, onAdd, onRemove;

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

<div class="notes">
  <div class="notes">
    <h4>Implementation notes</h4>
    {#each specifications as advice}
      <div class="advice-row" class:active={ticket.advices[advice]}>
        {advice} {renderChecks(ticket.advices[advice])}
        <button on:click={() => onRemove(advice)} name="remove-advice">
          &minus;
        </button>
        <button on:click={() => onAdd(advice)} name="add-advice">+</button>
      </div>
    {/each}
  </div>
</div>
