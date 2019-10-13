<script>
  import { onMount } from "svelte";
  import Menu from "./menu.svelte";
  export let ticket, onAdd, onRemove;

  function renderChecks(count) {
    if (!count) {
      return "";
    }
    let s = "";
    const n = Math.ceil((count - 1) / 2);
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
    {#each Object.keys(ticket.advices) as advice}
      <div class="advice-row">
        {advice} {renderChecks(ticket.advices[advice])}
        <button on:click={() => onRemove(advice)} name="remove-advice">
          &minus;
        </button>
        <button on:click={() => onAdd(advice)} name="add-advice">+</button>
      </div>
    {/each}
    <Menu onSelect={onAdd} selected={Object.keys(ticket.advices)} />
  </div>
</div>
