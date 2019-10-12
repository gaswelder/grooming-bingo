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

<style>
  .advice-row {
    position: relative;
    padding-right: 60px;
    min-width: 200px;
    line-height: 26px;
    color: gray;
  }
  .advice-row.active {
    color: black;
    font-weight: bolder;
  }
  .advice-row button {
    visibility: hidden;
    position: absolute;
    background: transparent;
    height: 26px;
    width: 26px;
    font-weight: bold;
    font-size: 14px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .advice-row:hover {
    background: rgba(9, 30, 66, 0.08);
  }
  .advice-row:hover button {
    visibility: visible;
  }
  .advice-row button:hover {
    background: rgba(9, 30, 66, 0.08);
  }
  .advice-row button[name="remove-advice"] {
    top: 0;
    right: 28px;
  }
  .advice-row button[name="add-advice"] {
    top: 0;
    right: 0;
  }
</style>

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
