<script>
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
</script>

<button on:click={() => (open = !open)}>...</button>
{#if open}
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
{/if}
