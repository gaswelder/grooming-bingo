<script>
  import Popover from "./popover.svelte";
  export let onSelect, selected;

  let open = false;

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

  function customInputKeypress(event) {
    if (event.key != "Enter") {
      return;
    }
    open = false;
    const val = event.target.value.trim();
    if (val != "") {
      onSelect(event.target.value);
    }
  }
</script>

<style>
  button {
    background-color: rgba(9, 30, 66, 0.04);
    box-shadow: none;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    height: 32px;
    margin-top: 8px;
    max-width: 300px;
    overflow: hidden;
    padding: 6px 12px;
    user-select: none;
    white-space: nowrap;
  }

  button:hover {
    background-color: rgba(9, 30, 66, 0.08);
    box-shadow: none;
    border: none;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    color: #172b4d;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    padding: 6px 12px;
  }
  li:hover {
    background-color: rgba(9, 30, 66, 0.04);
  }
</style>

<button on:click={() => (open = !open)}>...</button>
{#if open}
  <Popover>
    <ul>
      {#each specifications.filter(s => !selected.includes(s)) as spec}
        <li
          on:click={() => {
            onSelect(spec);
            open = false;
          }}>
          {spec}
        </li>
      {/each}
    </ul>
    <input on:keypress={customInputKeypress} />
  </Popover>
{/if}
