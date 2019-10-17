<script>
  import Text from "./text.svelte";
  export let typing;


</script>

<style>
  div {
    display: block;
    font-style: italic;
    height: auto;
    max-height: 100px;
    background-color: "red";
  }
  
</style>

<div >
    {#each typing as type}
      <p>@{type} is typing...</p>
    {/each}
</div>
