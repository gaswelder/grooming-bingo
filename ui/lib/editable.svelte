<script>
  import { createEventDispatcher, tick } from "svelte";
  export let text;

  const dispatch = createEventDispatcher();
  let editing = false;
  let input;

  async function begin() {
    editing = true;
    await tick();
    input.focus();
  }

  function apply(event) {
    dispatch("change", { newValue: event.target.value });
    editing = false;
  }
</script>

{#if editing}
  <input bind:this={input} value={text} on:change={apply} />
{:else}
  <span on:click={begin}>{text}</span>
{/if}
