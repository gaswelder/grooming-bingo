<script>
  export let users;
</script>

<style>
  span {
    display: inline-block;
    border-radius: 3px;
    background-color: #3bbf67;
    color: white;
    font-weight: bold;
    font-size: 11px;
    padding: 3px;
    margin-right: 4px;
  }
</style>

<div>
  {#each users as user}
    <span>{user}</span>
  {/each}
</div>
