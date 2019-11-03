<script>
  import Popover from "./popover.svelte";
  export let onSelect, selected;

  let open = false;

  const specifications = [
    "it's very easy",
    "it's not that hard",
    "пропозаль",
    "папап",
    "тогль",
    "I'm not sure",
    "it's a different card",
    "there's a card for that",
    "copypest",
    "exactly",
    "I have to look at the code",
    "makes sense",
    "does not make sense",
    "calculate",
    "we don't care",
    "it's very simple",
    "I don't know",
    "change that behavior"
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
    margin-top: 8px;
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

<svelte:body
  on:click={e => {
    if (e.target.closest('#menu-wrapper') === null && open) {
      open = false;
    }
  }}
  on:keyup={e => {
    if (e.key == 'Escape') {
      open = false;
    }
  }} />

<button on:click|stopPropagation={() => (open = !open)}>...</button>
<div id="menu-wrapper">
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
</div>
