<script>
  export let online;
</script>

<style>
  div {
    position: fixed;
    left: 50%;
    top: 50%;
    background: crimson;
    color: white;
    padding: 1em;
    border-radius: 8px;
  }
</style>

{#if !online}
  <div>Socket closed, reconnecting</div>
{/if}
