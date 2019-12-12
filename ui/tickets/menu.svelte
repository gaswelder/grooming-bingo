<script>
  import Popover from "../lib/popover.svelte";
  export let onSelect, selected;

  let open = false;

  const specifications = [
    "calculation",
    "change that behavior",
    "copypest",
    "does not make sense",
    "exactly",
    "functionality",
    "I have to look at the code",
    "I'm not sure",
    "it's very easy (simple)",
    "it's not that hard",
    "it's a different card / there's a card for that",
    "makes sense",
    "генерак",
    "гугел",
    "пропозаль",
    "папап",
    "тогль"
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
  input {
    margin: 10px 12px 8px;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-bottom: 8px;
    margin-top: 0;
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
      <input on:keypress={customInputKeypress} />
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
    </Popover>
  {/if}
</div>
