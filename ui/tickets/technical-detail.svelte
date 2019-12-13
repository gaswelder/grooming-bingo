<script>
  import { createEventDispatcher } from "svelte";
  export let text, count;

  const dispatch = createEventDispatcher();

  function renderChecks(count) {
    let s = "";
    for (let i = 0; i < count; i++) {
      s += "+";
    }
    return s;
  }
</script>

<style>
  div {
    position: relative;
    padding-right: 60px;
    line-height: 26px;
  }
  div button {
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
  div:hover {
    background: rgba(9, 30, 66, 0.08);
  }
  div:hover button {
    visibility: visible;
  }
  button:hover {
    background: rgba(9, 30, 66, 0.08);
  }
  button[name="remove-advice"] {
    top: 0;
    right: 28px;
  }
  button[name="add-advice"] {
    top: 0;
    right: 0;
  }
</style>

<div>
  {text} {renderChecks(count)}
  <button on:click={() => dispatch('minus')} name="remove-advice">
    &minus;
  </button>
  <button on:click={() => dispatch('plus')} name="add-advice">+</button>
</div>
