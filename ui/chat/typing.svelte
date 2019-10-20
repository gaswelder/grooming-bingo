<script>
  export let users;
  export let currentUser;

  $: typingUsers = users.filter(
    user => user.typing && user.name != currentUser
  );
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

<div>
  {#each typingUsers as user}
    <p>@{user.name} is typing...</p>
  {/each}
</div>
